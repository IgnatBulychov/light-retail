<template>
</template>
<script>

const fs = require("fs");
const w = require('node-atol-wrapper');
const fptr = new w.Fptr10();
const remote = require('electron').remote;
const application = remote.app;
export default {
    name: 'fiscal-printer',
    props: [ 'print', 'summ', 'getFromCustomer', 'paymentType'],
    data() {
        return {
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
      fptr.open()
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
      'print': function () {
        let app = this 
        if (this.print) {
          console.log("печать чека")
          if (currentFiscalPrinter.model = "Атол") {
            app.printCheckAtol()
          } else if (currentFiscalPrinter.model = "Меркурий") {
            app.printCheckMerc()
          }

          
        }
      }
    },
    methods: {
      printCheckAtol() {

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
          check.clientInfo.emailOrPhone = this.customer.email ? this.customer.email : this.customer.phone
          check.clientInfo.vatin = this.customer.vatin
          check.clientInfo.name = this.customer.name
        }

        check.items = []

        app.items.forEach(item => {
            check.items.push({
              type: "position",
              name: item.title,
              price: Number(Number(item.price).toFixed(2)),
              quantity: Number(item.quantity),
              amount: Number(Number(item.quantity*item.price).toFixed(2)),
              tax: {
                  type: item.tax
              },
              nomenclatureCode: item.nomenclatureCode,
              //paymentMethod: "fullPrepayment"
              paymentObject: "commodity"
            })
        });
        
        check.payments = []

        let sum = 0;

        if (isNaN(Number(app.getFromCustomer))) {
            sum = app.summ      
        } else {
            if (app.getFromCustomer == "") { 
            sum = Number(Number(app.summ).toFixed(2))
            } else if (Number(app.getFromCustomer) >= Number(app.summ)) {
            sum = Number(Number(app.getFromCustomer).toFixed(2))
            }

        }

        check.payments[0] =  {
              "type": app.paymentType,
              "sum":  app.paymentType == "electronically" ? Number(Number(app.summ).toFixed(2)) : sum
        }

  
        fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check) + "\n \n", function (err) {})            

        fptr.processJsonAsync(
        check,
        (err, result) => {
          if (err) {
            app.$emit('checkPrinted',{
              show: true,
              timeout: 3000,
              type: "error",
              text: 'Нет связи с кассой'
            })             
            fptr.close()   
            throw err;
          } else {
            fptr.close()   
            app.$emit('checkPrinted', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })       
          }
        });

        }
    },
    printCheckMerc() {

    }
}
</script>