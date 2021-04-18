<template>
<alert :alert="alert" />
</template>
<script>

import axios from 'axios'
import Alert from '../alerts/alert'
export default {
  name: 'merc-fiscal-printer',
  props: [  'print', 'checks', "cash" ],
  components: {
    Alert
  },
  data() {
      return {
        queries: [],
        sessionKey: "",
        checkTypes: [ 'sell', 'sellReturn','buy', 'buyReturn'],
        taxationTypes: ['osn','usnIncome', 'usnIncomeOutcome', 'envd', 'esn', 'patent' ],
        taxes: ['', 'vat20','vat10','vat120','vat110','vat0','none' ], // [0] - "" - из за другого подсчета в док-ии меркурий
        paymentMethods: ['','fullPrepayment', 'prepayment', 'advance', 'fullPayment', 'partialPayment', 'credit', 'creditPayment'],
        itemTypes: ['','commodity','excise', 'job','service','gamblingBet',
        'gamblingPrize','lottery','lotteryPrize','intellectualActivity',
        'payment','agentCommission','Составной предмет расчёта?','another',
        'proprietaryLaw', 'nonOperatingIncome', 'cmiContributions',
        'merchantTax','resortFee','deposit'],
        agents: ['bankPayingAgent','bankPayingSubagent', 'payingAgent', 'payingSubagent',
        'attorney','commissionAgent', 'another'],
        alert: {
          show: false,
          timeout: 2000,
          type: "success",
          text: ''
        }
      }
  },
  created() {
    let app = this

      var query = {
        command: "GetDriverInfo",
      };
      
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', 
        JSON.stringify(query)
      )
      .then(function (response) {
        console.log('incerman: ', response.data)
        if (!response.data.driverBaseVer) {
          app.alert = {
            type: 'error',
            show: true,
            text: 'Не установлена служба INCERMAN',
            timeout: 20000
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        app.alert = {
            type: 'error',
            show: true,
            text: 'Не установлена служба INCERMAN',
            timeout: 20000
          }
      });
  },
  computed: {
    currentFiscalPrinter() {
      return this.$store.getters['equipment/currentFiscalPrinter']
    },
   /* items() {
      return this.$store.state.check.items
    },*/
    currentUser() {
      return this.$store.state.users.currentUser
    },
    /*taxationType() {
        return this.$store.state.check.checkSettings.taxationType
    },*/
    checkType() {
        return this.$store.state.check.checkSettings.checkType
    },
    customer() {
        return this.$store.state.check.checkSettings.customer
    },
  },
  watch: {
    'print.check': function () {
          console.log("Печать кассового чека Меркурий")
          if (this.print.check) {
            this.checks.forEach(check => {
              this.printCheck(check)
            });   
          } 
      },
      'print.openShift': function () {
          console.log("печать Открытия смены Меркурий")
          if (this.print.openShift) {
            this.openShift()
          }           
      },
      'print.reportX': function () {
          console.log("печать Х отчета Меркурий")
          if (this.print.reportX) {
            this.$emit('check-printed-merk', {
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Не поддерживается этой моделью ККТ'
            })             
          }           
      },      
      'print.closeShift': function () {
          console.log("печать Закрытия смены Меркурий")
          if (this.print.closeShift) {
            this.closeShift()
          }           
      },
      'print.cashIn': function () {
          console.log("печать внесения Меркурий")
          if (this.print.cashIn) {
            this.cashIn()
          }           
      },
      'print.cashOut': function () {
          console.log("печать изъятия Меркурий")
          if (this.print.cashOut) {
            this.cashOut()
          }           
      }
  },
  methods: {
    printCheck() {
      let app = this
      // открытие сессии работы с ккт
      let query = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
      
      console.log("Меркурий: откртие сессии", query)
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(query))
      .then(function (responseFirst) {
          if (responseFirst.data.result != 0) {
            app.alert = {
              type: 'error',
              show: true,
              text: responseFirst.data.description,
              timeout: 5000
            }
          } else if (responseFirst.data.result == 0) {
            // открытие чека

            app.sessionKey = responseFirst.data.sessionKey
            let queryTwo = {
                sessionKey: app.sessionKey,
                command: "OpenCheck",
                checkType: app.checkTypes.findIndex(type => type == app.checkType),
                taxSystem: app.taxationTypes.findIndex(type => type == app.check.taxationType)
            }
            let cashierInfo = {}
            cashierInfo.cashierName = app.currentUser.name
            if (app.currentUser.vatin) {
              cashierInfo.cashierINN = app.currentUser.vatin
            }

            if (app.customer) {
              let buyerInfo = {}
              buyerInfo.buyerINN = app.customer.vatin
              buyerInfo.buyerName = app.customer.name
            }

            queryTwo.cashierInfo = cashierInfo
            queryTwo.buyerInfo = buyerInfo

            console.log("Меркурий: откртие чека", queryTwo)
            axios.post('http://localhost:50010/api.json', 
              JSON.stringify(queryTwo)
            )
            .then(function (responseSecond) {
                // добавление позиций
                
                app.check.items.forEach(item => {
                  let query = {
                    sessionKey: app.sessionKey,
                    command: "AddGoods"
                  }
                  if (item.mark) {
                    query.nomenclatureCode = item.rawDatamatrix
                  }
                  query.productName = item.title
                  query.qty = Number(item.quantity)*10000
                  query.taxCode = app.taxes.findIndex(tax => tax == item.tax)
                  query.paymentFormCode = app.paymentMethods.findIndex(paymentMethod => paymentMethod == item.paymentMethod)
                  query.productTypeCode = app.itemTypes.findIndex(itemType => itemType == item.itemType)
                  query.price = Number(item.price)*100
                  query.sum = qery.qty*qery.price
                  if (item.agencyScheme.agents.length) {
                    query.agent = {}
                    query.agent.code = app.agents.findIndex(agent => agent == item.agencyScheme.agents[0]) // берем первый тип агента,т.к. меркрурий поддерживает только один тип
                    
                    if (query.agent.code == 0) {
                      query.agent.payingOp = item.agencyScheme.payingAgent.operation
                      query.agent.payingPhone = item.agencyScheme.payingAgent.phones
                      query.agent.transfName = item.agencyScheme.moneyTransferOperator.name
                      query.agent.transfINN = item.agencyScheme.moneyTransferOperator.vatin
                      query.agent.transfAddress = item.agencyScheme.moneyTransferOperator.address
                      query.agent.transfPhone = item.agencyScheme.moneyTransferOperator.phones
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    } else if (query.agent.code == 1) {
                      query.agent.payingOp = item.agencyScheme.payingAgent.operation
                      query.agent.payingPhone = item.agencyScheme.payingAgent.phones
                      query.agent.transfName = item.agencyScheme.moneyTransferOperator.name
                      query.agent.transfINN = item.agencyScheme.moneyTransferOperator.vatin
                      query.agent.transfAddress = item.agencyScheme.moneyTransferOperator.address
                      query.agent.transfPhone = item.agencyScheme.moneyTransferOperator.phones 
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    } else if  (query.agent.code == 2) {
                      query.agent.payingPhone = item.agencyScheme.payingAgent.phones
                      query.agent.operatorPhone = item.agencyScheme.receivePaymentsOperator.phones
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    } else if (query.agent.code == 3) {
                      query.agent.payingPhone = item.agencyScheme.payingAgent.phones
                      query.agent.operatorPhone = item.agencyScheme.receivePaymentsOperator.phones
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name 
                    } else if (query.agent.code == 4) {
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    } else if  (query.agent.code == 5) {
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    }  else if (query.agent.code == 6) {
                      query.agent.supplierPhone = item.agencyScheme.supplier.phones
                      query.agent.supplierINN = item.agencyScheme.supplier.vatin
                      query.agent.supplierName = item.agencyScheme.supplier.name
                    }
                    
                  }
                  app.queries.push(query)
                });
                
                app.addItemToCheck()

                
            })
          }
          console.log(response);
        })
  

    },
    addItemToCheck() {
      let app = this
      if (app.queries.length) {
        console.log("Меркурий: + позиция", app.queries[0])
        axios.post('http://localhost:50010/api.json', JSON.stringify(app.queries[0]))
        .then(function (responseFirst) {
          if (responseFirst.data.result != 0) {
            app.alert = {
              type: 'error',
              show: true,
              text: responseFirst.data.description,
              timeout: 5000
            }
          } else if (responseFirst.data.result == 0) {
            app.queries.splice(0, 1)
            app.addItemToCheck()
          }
        })
      } else {
        // закртыие чека
        let query = {
          sessionKey: app.sessionKey,
          command: "CloseCheck"
        }
        if (app.customer.email || app.customer.phone) {            
          query.sendCheckTo = app.customer.email ? app.customer.email : app.customer.phone
        }
        query.payment = {}

        app.check.payments.forEach(payment => {
          if (payment.type == 'cash') {
            query.payment.cash = Number(payment.sum)*100            
          }
          if (payment.type == 'electronically') {
            query.payment.ecash = Number(payment.sum)*100            
          }
          if (payment.type == 'prepaid') {
            query.payment.prepayment = Number(payment.sum)*100            
          }
          if (payment.type == 'credit') {
            query.payment.credit = Number(payment.sum)*100            
          }
          if (payment.type == 'other') {
            query.payment.consideration = Number(payment.sum)*100            
          }
        });
/*
        if (app.paymentType == 'cash') {
          query.payment.cash = Number(app.check.acceptedFromCustomer)*100            
        } else if (app.paymentType == 'electronically') {
          query.payment.ecash = Number(app.check.acceptedFromCustomer)*100      
        } else if (app.paymentType == 'prepaid') {
          query.payment.prepayment = Number(app.check.acceptedFromCustomer)*100      
        } else if (app.paymentType == 'credit') {
          query.payment.credit = Number(app.check.acceptedFromCustomer)*100      
        } else if (app.paymentType == 'other') {
          query.payment.consideration = Number(app.check.acceptedFromCustomer)*100      
        } else {     
          // если в оплате объект, значит там комбооплата       
          for (var key in app.paymentType) {
            if (app.paymentType[key]) {
              if (key == 'cash') {
                query.payment.cash = Number(app.check.acceptedFromCustomer)*100            
              } else if (key == 'electronically') {
                query.payment.ecash = Number(app.check.acceptedFromCustomer)*100      
              } else if (key == 'prepaid') {
                query.payment.prepayment = Number(app.check.acceptedFromCustomer)*100      
              } else if (key == 'credit') {
                query.payment.credit = Number(app.check.acceptedFromCustomer)*100      
              } else if (key == 'other') {
                query.payment.consideration = Number(app.check.acceptedFromCustomer)*100      
              }                
            }
          }            
        }*/
        console.log("Меркурий: закрытие чека", query)
        axios.post('http://localhost:50010/api.json', JSON.stringify(query))
        .then (responseSecond => {
          if (responseSecond.data.result != 0) {
            app.alert = {
              type: 'error',
              show: true,
              text: responseSecond.data.description,
              timeout: 5000
            }
          } else if (responseSecond.data.result == 0) {
            // закртыие сессии работы с ккт
                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: app.sessionKey,
                    command: "CloseSession"
                  })
                ).then (responseThree => {

                  if (responseThree.data.result != 0) {
                    app.alert = {
                      type: 'error',
                      show: true,
                      text: responseThree.data.description,
                      timeout: 5000
                    }
                  } else if (responseThree.data.result == 0) {
                          
                    this.$emit('check-printed-merk', {
                          show: true,
                          timeout: 3000,
                          type: "success",
                          text: 'Операция выполнена'
                        }) 
                  }
                })
          }
          
        })
        
            
      }           
    },
    openShift() {
      let app = this
      // открытие сессии работы с ккт
      let queryOpenSession = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
      
      console.log("Меркурий: откртие сессии", queryOpenSession)
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(queryOpenSession))
      .then(function (responseOpenSession) {
          if (responseOpenSession.data.result != 0) {
            app.$emit('check-printed-merk', {
              type: 'error',
              show: true,
              text: responseOpenSession.data.description,
              timeout: 5000
            })
          } else if (responseOpenSession.data.result == 0) {

            app.sessionKey = responseOpenSession.data.sessionKey
            let queryOpenShift = {
                sessionKey: app.sessionKey,
                command: "OpenShift"
            }
            let cashierInfo = {}
            cashierInfo.cashierName = app.currentUser.name
            if (app.currentUser.vatin) {
              cashierInfo.cashierINN = app.currentUser.vatin
            }
            queryOpenShift.cashierInfo = cashierInfo

            axios.post('http://localhost:50010/api.json', JSON.stringify(queryOpenShift))
            .then (responseOpenShift => {

              if (responseOpenShift.data.result != 0) {
                app.$emit('check-printed-merk', {
                  type: 'error',
                  show: true,
                  text: responseOpenShift.data.description,
                  timeout: 5000
                })
              } else if (responseOpenShift.data.result == 0) {

                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: app.sessionKey,
                    command: "CloseSession"
                  })
                )
                .then (responseCloseSession => {

                  if (responseCloseSession.data.result != 0) {
                    app.$emit('check-printed-merk', {
                      type: 'error',
                      show: true,
                      text: responseCloseSession.data.description,
                      timeout: 5000
                    })
                  } else if (responseCloseSession.data.result == 0) {
                          
                        app.$emit('check-printed-merk', {
                          show: true,
                          timeout: 3000,
                          type: "success",
                          text: 'Операция выполнена'
                        }) 
                  }
                })
                      
               
              }
            })
          }
        })
        
    },
    closeShift() {
      let app = this
      // открытие сессии работы с ккт
      let queryOpenSession = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
      
      console.log("Меркурий: откртие сессии", queryOpenSession)
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(queryOpenSession))
      .then(function (responseOpenSession) {
          if (responseOpenSession.data.result != 0) {
            app.$emit('check-printed-merk', {
              type: 'error',
              show: true,
              text: responseOpenSession.data.description,
              timeout: 5000
            })
          } else if (responseOpenSession.data.result == 0) {

            app.sessionKey = responseOpenSession.data.sessionKey
            let queryCloseShift = {
                sessionKey: app.sessionKey,
                command: "CloseShift"
            }
            let cashierInfo = {}
            cashierInfo.cashierName = app.currentUser.name
            if (app.currentUser.vatin) {
              cashierInfo.cashierINN = app.currentUser.vatin
            }
            queryCloseShift.cashierInfo = cashierInfo

            axios.post('http://localhost:50010/api.json', JSON.stringify(queryCloseShift))
            .then (responseCloseShift => {

              if (responseCloseShift.data.result != 0) {
                app.$emit('check-printed-merk', {
                  type: 'error',
                  show: true,
                  text: responseCloseShift.data.description,
                  timeout: 5000
                })
              } else if (responseCloseShift.data.result == 0) {

                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: app.sessionKey,
                    command: "CloseSession"
                  })
                )
                .then (responseCloseSession => {

                  if (responseCloseSession.data.result != 0) {
                    app.$emit('check-printed-merk', {
                      type: 'error',
                      show: true,
                      text: responseCloseSession.data.description,
                      timeout: 5000
                    })
                  } else if (responseCloseSession.data.result == 0) {
                          
                        app.$emit('check-printed-merk', {
                          show: true,
                          timeout: 3000,
                          type: "success",
                          text: 'Операция выполнена'
                        }) 
                  }
                })
                      
               
              }
            })
          }
        })
        
    },
    cashIn() {
      let app = this
      // открытие сессии работы с ккт
      let queryOpenSession = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
      
      console.log("Меркурий: откртие сессии", queryOpenSession)
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(queryOpenSession))
      .then(function (responseOpenSession) {
          if (responseOpenSession.data.result != 0) {
            app.$emit('check-printed-merk', {
              type: 'error',
              show: true,
              text: responseOpenSession.data.description,
              timeout: 5000
            })
          } else if (responseOpenSession.data.result == 0) {

            app.sessionKey = responseOpenSession.data.sessionKey
            let queryCashIn = {
                sessionKey: app.sessionKey,
                command: "BringMoney"
            }
            let cashierInfo = {}
            cashierInfo.cashierName = app.currentUser.name
            if (app.currentUser.vatin) {
              cashierInfo.cashierINN = app.currentUser.vatin
            }
            queryCashIn.cashierInfo = cashierInfo
            queryCashIn.cash = Number(app.cash*100)

            axios.post('http://localhost:50010/api.json', JSON.stringify(queryCashIn))
            .then (responseCashIn => {

              if (responseCashIn.data.result != 0) {
                app.$emit('check-printed-merk', {
                  type: 'error',
                  show: true,
                  text: responseCashIn.data.description,
                  timeout: 5000
                })
              } else if (responseCashIn.data.result == 0) {

                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: app.sessionKey,
                    command: "CloseSession"
                  })
                )
                .then (responseCloseSession => {

                  if (responseCloseSession.data.result != 0) {
                    app.$emit('check-printed-merk', {
                      type: 'error',
                      show: true,
                      text: responseCloseSession.data.description,
                      timeout: 5000
                    })
                  } else if (responseCloseSession.data.result == 0) {
                          
                        app.$emit('check-printed-merk', {
                          show: true,
                          timeout: 3000,
                          type: "success",
                          text: 'Операция выполнена'
                        }) 
                  }
                })
                      
               
              }
            })
          }
        })
        
    },
    cashOut() {
      let app = this
      // открытие сессии работы с ккт
      let queryOpenSession = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
      
      console.log("Меркурий: откртие сессии", queryOpenSession)
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(queryOpenSession))
      .then(function (responseOpenSession) {
          if (responseOpenSession.data.result != 0) {
            app.$emit('check-printed-merk', {
              type: 'error',
              show: true,
              text: responseOpenSession.data.description,
              timeout: 5000
            })
          } else if (responseOpenSession.data.result == 0) {

            app.sessionKey = responseOpenSession.data.sessionKey
            let queryCashOut = {
                sessionKey: app.sessionKey,
                command: "WithdrawMoney"
            }
            let cashierInfo = {}
            cashierInfo.cashierName = app.currentUser.name
            if (app.currentUser.vatin) {
              cashierInfo.cashierINN = app.currentUser.vatin
            }
            queryCashOut.cashierInfo = cashierInfo
            queryCashOut.cash = Number(app.cash*100)

            axios.post('http://localhost:50010/api.json', JSON.stringify(queryCashOut))
            .then (responseCashOut => {

              if (responseCashOut.data.result != 0) {
                app.$emit('check-printed-merk', {
                  type: 'error',
                  show: true,
                  text: responseCashOut.data.description,
                  timeout: 5000
                })
              } else if (responseCashOut.data.result == 0) {

                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: app.sessionKey,
                    command: "CloseSession"
                  })
                )
                .then (responseCloseSession => {

                  if (responseCloseSession.data.result != 0) {
                    app.$emit('check-printed-merk', {
                      type: 'error',
                      show: true,
                      text: responseCloseSession.data.description,
                      timeout: 5000
                    })
                  } else if (responseCloseSession.data.result == 0) {
                          
                        app.$emit('check-printed-merk', {
                          show: true,
                          timeout: 3000,
                          type: "success",
                          text: 'Операция выполнена'
                        }) 
                  }
                })
                      
               
              }
            })
          }
        })
        
    },
  }
}
</script>