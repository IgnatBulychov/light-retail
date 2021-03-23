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

export default {
    name: 'atol-fiscal-printer',
    props:[ 'printAtol', 'summ', 'getFromCustomer', 'paymentType'],
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
          },
          lodaing: false
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
      console.log('getSettings',fptr.getSettings());
      
      this.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: fptr.open()
        }
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
      taxationType() {
          return this.$store.state.check.checkSettings.taxationType
      },
      checkType() {
          return this.$store.state.check.checkSettings.checkType
      },
      customer() {
          return this.$store.state.check.checkSettings.customer
      },
    },
    watch: {
      'printAtol': function () {
          let app = this 
          console.log("печать чека Атол")
          if (app.printAtol) {
            app.printCheck()
          } 
          
      }
    },
    methods: {
      printCheck() {
        this.alert = {
          show: false,
          timeout: 3000,
          type: "error",
          text: 'Нет связи с кассой'
        }
        let app = this

        let check = {}

        check.type = app.checkType
        check.taxationType = app.taxationType
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

        for (let i = 0; i < app.items.length; i++) {
            
            check.items.push({
              type: "position",
              name: app.items[i].title,
              price: Number(Number(app.items[i].price).toFixed(2)),
              quantity: Number(app.items[i].quantity),
              amount: Number(Number(app.items[i].quantity*app.items[i].price).toFixed(2)),
              tax: {
                  type: app.items[i].tax
              },
              nomenclatureCode: app.items[i].nomenclatureCode,
              paymentMethod: app.items[i].paymentMethod,
              paymentObject: app.items[i].itemType
            })

            if (app.items[i].agencyScheme.agents.length) {
              check.items[i].agentInfo = {}
              check.items[i].agentInfo.agents = app.items[i].agencyScheme.agents
              check.items[i].agentInfo.payingAgent = app.items[i].agencyScheme.payingAgent
              check.items[i].agentInfo.receivePaymentsOperator = app.items[i].agencyScheme.receivePaymentsOperator
              check.items[i].agentInfo.moneyTransferOperator = app.items[i].agencyScheme.moneyTransferOperator
            }
            if (app.items[i].agencyScheme.supplier) {
              check.items[i].supplierInfo = {}
              check.items[i].supplierInfo.phones = app.items[i].agencyScheme.supplier.phones
              check.items[i].supplierInfo.name = app.items[i].agencyScheme.supplier.name
              check.items[i].supplierInfo.vatin = app.items[i].agencyScheme.supplier.vatin
            }
        }
        
        check.payments = []

//если строка, то уже определен тип, если обьект - то комбооплата
        if (typeof app.paymentType == 'string') {
          check.payments.push({
              "type": app.paymentType,
              "sum": Number(app.getFromCustomer).toFixed(2)
          })
        } else {
          for (var key in app.paymentType) {
            if (app.paymentType[key]) {
              check.payments.push({
                  "type": key,
                  "sum": Number(app.paymentType[key]).toFixed(2)
              })
            }
          }
          
        }

        fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check) + "\n \n", function (err) {})            

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
            fptr.close()   
            app.$emit('check-printed-atol', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })       
          }
        });

        },
        openShift() {
          let app = this
          app.lodaing = true
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
              app.lodaing = false
              app.$emit('check-printed-atol',{
                show: true,
                timeout: 3000,
                type: "error",
                text: 'Нет связи с кассой'
              }) 
              fptr.close()   
              throw err;
            } else {
              app.lodaing = false
              console.log('reportX', result);  
              app.$emit('check-printed-atol', {
                show: true,
                timeout: 3000,
                type: "success",
                text: 'Операция выполнена'
              }) 
              fptr.close()      
            }
          });
          
          fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-openShift.log", task)
        },
    }
}
</script>