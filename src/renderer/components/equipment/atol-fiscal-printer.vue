<template>
<alert :alert="alert" />
</template>
<script>

const fs = require("fs");
const w = require('node-atol-wrapper');
const fptr = new w.Fptr10();
const remote = require('electron').remote;
const application = remote.app;
import Alert from '../alerts/alert'
var hex64 = require('hex64');
export default {
    name: 'atol-fiscal-printer',
    props:[ 'print', "checks", "cash"],
    components: {
      Alert
    },
    data() {
        return {
          alert: {
            show: false,
            timeout: 2000,
            type: "success",
            text: ''
          }
        }
    },
    destroyed() {
      fptr.close()
      fptr.destroy()
    },
    created() {
      fptr.create();
      let settings = {}
      settings = fptr.getSettings();     
      settings.Port = this.currentFiscalPrinter.settings.connection;  // ComPort communication
      // settings.ComFile = '/dev/ttyACM0'; //ComPort name
      settings.ComFile = this.currentFiscalPrinter.settings.comFile;  // ComPort name
      settings.BaudRate = this.currentFiscalPrinter.settings.baudRate;
      settings.IPAddress = this.currentFiscalPrinter.settings.IPAddress;
      settings.IPPort = this.currentFiscalPrinter.settings.IPPort;
      console.log('setSettings', fptr.setSettings(settings));
      console.log('getSettings',fptr.getSettings())
      

      
      
    },
    computed: {
      currentFiscalPrinter() {
        return this.$store.getters['equipment/currentFiscalPrinter']
      },
      items() {
        return this.$store.state.check.items
      },
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
      /*payments() {
          return this.$store.state.check.payments
      },*/
    },
    watch: {
      'print.check': function () {
          console.log("Печать кассового чека Атол")
          if (this.print.check) {
            this.checks.forEach(check => {
              this.printCheck(check)
            });            
          } 
      },
      'print.openShift': function () {
          console.log("печать Открытия смены Атол")
          if (this.print.openShift) {
            this.openShift()
          }           
      },
      'print.reportX': function () {
          console.log("печать X отчета Атол")
          if (this.print.reportX) {
            this.reportX()
          }           
      },
      'print.closeShift': function () {
          console.log("печать Закрытия смены Атол")
          if (this.print.closeShift) {
            this.closeShift()
          }           
      },
      'print.cashIn': function () {
          console.log("печать внесения Атол")
          if (this.print.cashIn) {
            this.cashIn()
          }           
      },
      'print.cashOut': function () {
          console.log("печать изъятия Атол")
          if (this.print.cashOut) {
            this.cashOut()
          }           
      }
    },
    methods: {
      printCheck(checkData) {

        
       
        let app = this

        let check = {}

        check.type = app.checkType
        check.taxationType = checkData.taxationType
        check.operator = {
          name: ""
        }
        check.operator.name = app.currentUser.name
        if (app.currentUser.vatin) {
          check.operator.vatin = app.currentUser.vatin
        }  

        if (this.customer) {
          check.clientInfo = {}
          if (this.customer.email || this.customer.phone) {            
            check.clientInfo.emailOrPhone = this.customer.email ? this.customer.email : this.customer.phone
          }
          check.clientInfo.vatin = this.customer.vatin
          check.clientInfo.name = this.customer.name
        }

        check.items = []

        for (let i = 0; i < checkData.items.length; i++) {
            
            check.items.push({
              type: "position",
              name: checkData.items[i].title,
              price: Number(Number(checkData.items[i].price).toFixed(2)),
              quantity: Number(checkData.items[i].quantity),
              amount: Number(Number(checkData.items[i].quantity*checkData.items[i].price).toFixed(2)),
              tax: {
                  type: app.items[i].tax
              },
              //mark: hex64.toBase64(checkData.items[i].rawDatamatrix),
              nomenclatureCode: checkData.items[i].nomenclatureCode,
              paymentMethod: checkData.items[i].paymentMethod,
              paymentObject: checkData.items[i].itemType
            })

            if (checkData.items[i].agencyScheme) {
              if (checkData.items[i].agencyScheme.agents.length) {
                check.items[i].agentInfo = {}
                check.items[i].agentInfo.agents = checkData.items[i].agencyScheme.agents
                check.items[i].agentInfo.payingAgent = checkData.items[i].agencyScheme.payingAgent
                check.items[i].agentInfo.receivePaymentsOperator = checkData.items[i].agencyScheme.receivePaymentsOperator
                check.items[i].agentInfo.moneyTransferOperator = checkData.items[i].agencyScheme.moneyTransferOperator
              }
              if (checkData.items[i].agencyScheme.supplier) {
                check.items[i].supplierInfo = {}
                check.items[i].supplierInfo.phones = checkData.items[i].agencyScheme.supplier.phones
                check.items[i].supplierInfo.name = checkData.items[i].agencyScheme.supplier.name
                check.items[i].supplierInfo.vatin = checkData.items[i].agencyScheme.supplier.vatin
              }
            }            
        }
        
        check.payments = checkData.payments
/*
//если строка, то уже определен тип, если обьект - то комбооплата
        if (typeof app.paymentType == 'string') {
          check.payments.push({
              "type": app.paymentType,
              "sum": Number(Number(app.getFromCustomer).toFixed(2))
          })
        } else {
          for (var key in app.paymentType) {
            if (app.paymentType[key]) {
              check.payments.push({
                  "type": key,
                  "sum": Number(Number(app.paymentType[key]).toFixed(2))
              })
            }
          }
          
        }*/

        fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check) + "\n \n", function (err) {})            

try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        
        fptr.processJsonAsync(
        check,
        (err, result) => {
          if (err) {
            console.log('Атол: ошибка печати чека')
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            })   
            fptr.close() 
            throw err;
          } else {
               
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })       
            fptr.close()
          }
        });

      },
      openShift() {
        try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        let app = this
        let task = {}
        task.type = "openShift"
        task.operator = {}
        task.operator.name = app.currentUser.name
        if (task.operator.vatin) {
          task.operator.vatin = app.currentUser.vatin
        }
        fptr.processJsonAsync(
        task,
        (err, result) => {
          if (err) {
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            }) 
            fptr.close()
            throw err;
          } else {
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            }) 
            fptr.close()    
          }
        });
        fs.appendFile(application.getPath('userData') + "/logs/openShift.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(task) + "\n \n", function (err) {}) 
      },
      reportX() {
         try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        let app = this
        app.reportXLodaing = true
        let task = {}
        task.type = "reportX"
        task.operator = {}
        task.operator.name = app.currentUser.name
        if (task.operator.vatin) {
          task.operator.vatin = app.currentUser.vatin
        }
        fptr.processJsonAsync(
        task,
        (err, result) => {
          if (err) {
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            }) 
            fptr.close() 
            throw err;
          } else {
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
            fptr.close() 
            console.log('reportX', result);        
          }
        });
        fs.appendFile(application.getPath('userData') + "/logs/reportX.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(task) + "\n \n", function (err) {}) 
      },
      closeShift() {
         try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        let app = this
        let task = {}
        task.type = "closeShift"
        task.operator = {}
        task.operator.name = app.currentUser.name
        if (task.operator.vatin) {
          task.operator.vatin = app.currentUser.vatin
        }
        fptr.processJsonAsync(
        task,
        (err, result) => {
          if (err) {
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            }) 
            fptr.close()
            throw err;
          } else {
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
            fptr.close()  
            console.log('closeShift', result);        
          }
        });
       fs.appendFile(application.getPath('userData') + "/logs/closeShift.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(task) + "\n \n", function (err) {}) 
      },
      cashIn() {
         try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        let app = this
        let task = {}
        task.type = "cashIn"
        task.operator = {}
        task.operator.name = app.currentUser.name
        if (task.operator.vatin) {
          task.operator.vatin = app.currentUser.vatin
        }
        task.cashSum = Number(Number(app.cash).toFixed(2)),
        fptr.processJsonAsync(
        task,
        (err, result) => {
          if (err) {
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            }) 
            fptr.close()
            throw err;
          } else {
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
            fptr.close() 
            console.log('cashIn', result);        
          }
        });
        fs.appendFile(application.getPath('userData') + "/logs/cashIn.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(task) + "\n \n", function (err) {}) 
      },
      cashOut() {
         try {
          fptr.open()
        } catch (e) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: e.message + " " + e.code + " " + e.description
          }
          fptr.close() 
          return
        }
        let app = this
        let task = {}
        task.type = "cashOut"
        task.operator = {}
        task.operator.name = app.currentUser.name
        if (task.operator.vatin) {
          task.operator.vatin = app.currentUser.vatin
        }
        task.cashSum = Number(Number(app.cash).toFixed(2)),
        fptr.processJsonAsync(
        task,
        (err, result) => {
          if (err) {
            app.$emit('check-printed-atol',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            }) 
            fptr.close()
            throw err;
          } else {
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })
            fptr.close()  
            console.log('cashOut', result);        
          }
        });
        fs.appendFile(application.getPath('userData') + "/logs/cashOut.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(task) + "\n \n", function (err) {}) 
      },
    }
}
</script>