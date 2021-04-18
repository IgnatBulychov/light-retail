<template>
  <div>
    <alert :alert="alert"/>
    <atol-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Атол'"
      @check-printed-atol="checkPrinted" 
      :print="printAtol" 
      :checks="checks"
      :cash="cash"
    />
    <merc-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Меркурий'" 
      @check-printed-merk="checkPrinted" 
      :print="printMerc" 
      :checks="checks"
      :cash="cash"
    />
  </div>
</template>
<script>

import Alert from '../alerts/alert'
import AtolFiscalPrinter from './atol-fiscal-printer.vue'
import MercFiscalPrinter from './merc-fiscal-printer.vue'
export default {
    name: 'fiscal-printer',
    props:  ['print', "cash"],
    components: {
      Alert, AtolFiscalPrinter, MercFiscalPrinter
    },
    data() {
        return {
          alert: {
            show: false,
            timeout: 2000,
            type: "success",
            text: ''
          },
          printAtol:{
            check: false,
            openShift: false,
            reportX: false,
            closeShift: false,
            cashIn: false,
            cashOut: false
          },
          printMerk:{
            check: false,
            openShift: false,
            reportX: false,
            closeShift: false,
            cashIn: false,
            cashOut: false
          },
          checks:[]
        }
    },
    created() {
      if (!this.currentFiscalPrinter) {
        this.alert = {
          show: true,
            timeout: 2000,
            type: "error",
            text: 'Фискальный регистратор не настроен'
        }
      }      
    },
    computed: {
      currentFiscalPrinter() {
        return this.$store.getters['equipment/currentFiscalPrinter']
      },
      currentFiscalPrinterModel() {
        if (this.currentFiscalPrinter) {
          return this.currentFiscalPrinter.model
        } else {
          return null
        }
      },
      items() {
        return this.$store.state.check.items
      },
      currentUser() {
        return this.$store.state.users.currentUser
      },
      taxationType() {
          return this.$store.state.check.checkSettings.taxationType
      },
      checkType() {
          return this.$store.state.check.checkSettings.checkType
      },
      customer() {
          return this.$store.state.check.checkSettings.customer
      },
      payments() {
          return this.$store.state.check.payments
      },
      taxations() {
        let taxations = []
        this.items.forEach(element => {
          if (!taxations.includes(element.taxationType)) {
            taxations.push(element.taxationType)
          }          
        });
        return taxations
      },
    },
    watch: {
      'print.check': function () {
        let app = this 
        if (this.taxations.length > 1) {
          this.devideCheck()
        } else {
          if (this.print.check) {
            console.log("печать чека")
            if (this.currentFiscalPrinterModel == "Атол") {
              let check = {}
              check.items = app.items
              check.payments = app.payments
              check.taxationType = app.taxationType
              app.checks.push(check)
              app.printAtol.check = true
              console.log("печать чека атол")
            } else if (this.currentFiscalPrinterModel == "Меркурий") {
              let check = {}
              check.items = app.items
              check.payments = app.payments
              check.taxationType = app.taxationType
              app.checks.push(check)
              app.printMerc.check = true
              console.log("печать чека меркурий")
            }          
          }
        }
      },
      'print.openShift':function () {
        if (this.print.openShift) {
          console.log("печать Открытия смены ")
          if (this.currentFiscalPrinterModel == "Атол") {
            this.printAtol.openShift = true
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            this.printMerk.openShift = true
          }          
        }
      },
      'print.reportX':function () {
        if (this.print.reportX) {
          if (this.currentFiscalPrinterModel == "Атол") {
            this.printAtol.reportX = true
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            this.printMerk.reportX = true
          }          
        }
      },
      'print.closeShift':function () {
        if (this.print.closeShift) {
          if (this.currentFiscalPrinterModel == "Атол") {
            this.printAtol.closeShift = true
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            this.printMerk.closeShift = true
          }          
        }
      },
       'print.cashIn':function () {
        if (this.print.cashIn) {
          if (this.currentFiscalPrinterModel == "Атол") {
            this.printAtol.cashIn = true
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            this.printMerk.cashIn = true
          }          
        }
      },
      'print.cashOut':function () {
        if (this.print.cashOut) {
          if (this.currentFiscalPrinterModel == "Атол") {
            this.printAtol.cashOut = true
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            this.printMerk.cashOut = true
          }          
        }
      },
    },
    methods: {
      devideCheck() {
        //разбираемся с разными СНО. Поочередно перебираем группы товаров и применяем к ним оплаты, заканчивая налом

        //разедляем чек по СНО
        let checks = []
        this.taxations.forEach(element => {
          let items = this.items.filter(item => item.taxationType == element);
          checks.push({
            items: items,
            taxationType: element,
            payments: []
          })
        });

      /*  checks.forEach(check => {
          let sum = 0
          check.items.forEach(item => {
            sum = sum + (item.price * item.quantity)
          });
          check.sum = sum.toFixed(2)
        });*/

        console.log(checks)

        for (let index = 0; index < checks.length; index++) {
          this.payments.forEach(payment => {
            if (index == checks.length - 1) {
              if (payment.sum) {
                checks[index].payments.push({
                  type: payment.type,
                  sum: Math.floor(payment.sum / checks.length) + payment.sum % checks.length
                })
              } 
            } else {
              if (payment.sum) {
                checks[index].payments.push({
                  type: payment.type,
                  sum: Math.floor(payment.sum / checks.length)
                })
              } 
            }
                      
          });
        }
        
/*
        let devidePayments = []
        this.payments.forEach(payment => {          
          devidePayments.push({
            type: payment.type,
            sum: payment.sum / checks.length
          })
        })

        for (let index = 0; index < checks.length; index++) {
          checks[index].payments = devidePayments[index]          
        }
*/
        checks.forEach(check => {
          this.checks.push(check)
        });
        
         if (this.print.check) {
            console.log("печать чека")
            if (this.currentFiscalPrinterModel == "Атол") {
              this.printAtol.check = true
              console.log("печать чека атол")
            } else if (this.currentFiscalPrinterModel == "Меркурий") {
              this.printMerc.check = true
              console.log("печать чека меркурий")
            }          
          }
        
      /*
        let payments = []
        this.payments.forEach(element => {
          let clone = {}
          Object.assign(clone, element)
          payments.push(clone)
        });

        console.log('222', payments)

        // перенести нал в конец массива
       let cashPayment = payments.find(payment => payment.type == 'cash')
        let cashPaymentIndex = payments.findIndex(payment => payment.type == 'cash')
        if (cashPayment) {
          payments.push(cashPayment)
          payments.splice(cashPaymentIndex, 1)
          
        }

        console.log('111', payments)

        // рекурсиваня функция присвоения оплат
        let checkPaymentСapability = function (sum, payments, additionPayment) {
          
          let paymentIndex = payments.findIndex(payment => payment.sum > 0)
         
          //if (payments[paymentIndex].sum != -1) {
            if (((payments[paymentIndex].sum + additionPayment) - sum) >= 0) {

              let readyPayments = []
              readyPayments.push({
                type: payments[paymentIndex].type,
                sum: sum
              })

              if (additionPayment) {
                  readyPayments.push(additionPayment)              
              }
              
              payments[paymentIndex].sum = payments[paymentIndex].sum - sum
              
              return readyPayments
            } else {
              
              sum = sum - payments[paymentIndex].sum
              
              payments[paymentIndex].sum = 0 //payments[paymentIndex].sum - sum

              let readyPayment = {
                type: payments[paymentIndex].type,
                sum: payments[paymentIndex].sum
              }

              checkPaymentСapability(sum, payments, readyPayment)
            }
          //}
          //return additionPayments
        }
        
        


        checks.forEach(check => {
          console.log('-)', check.sum)
          check.payments = checkPaymentСapability(check.sum, payments, null)
        });

        console.log('ГОТОВо', checks)
*/

/* в преспективе попробовать сделать рекурсию, чтобы не зависило от типов оплат, но пока просто перебор заранее известных типов оплат
        
        
         // перенести нал в конец массива?

        let currentPayment = 0
        let maxPaymentNumber = this.payments.length - 1

        let currentCheck = 0
        let maxCheckNumber = this.checks.length - 1

        let checkPaymentСapability = function () {
          if(currentCheck == maxCheckNumber)
           if ((this.payments[currentPayment].sum - checks[currentCheck].sum) >= 0) {
              checks[currentCheck].payments.push({
                "type": this.payments[currentPayment].type,
                "sum": this.payments[currentPayment].sum - check.sum
              })
              currentCheck++
              checkPaymentСapability()
            } else {
              checks[currentCheck].sum = checks[currentCheck].sum - this.payments[currentPayment].sum
              currentPayment++
              checkPaymentСapability()
            }
        }

        checkPaymentСapability()
        */
       /* 
        push({
                "type": key,
                "sum": Number(Number(app.getFromCustomer).toFixed(2))
            })

        if (typeof app.paymentType == 'string') {
          // если только нал 
          if (app.paymentType == 'cash') {

          // если только 1 оплата цельного типа(безнал, предоплата, кредит, другая)
          } else {
            checks.forEach(check => {
              check.payments = [this.aceptedFromCustomer]
            })
          }
        } else {
          // если передан объект оплат
          for (var key in this.paymentType) {
            //
          }
        }
*/
        



      },
      checkPrinted(result) {
        this.$emit('check-printed',result )
         this.checks = []
        this.alert = result
        for (var key in this.printMerk) {
          this.printMerk[key] = false
        }
        for (var key in this.printAtol) {
          this.printAtol[key] = false
        }        
      }
    }
}
</script>