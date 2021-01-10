<template>
    
</template>
<script>


import { getEquipmentFromBase } from '../../store/dbAPI/equipment/getEquipment'

import { printFiscalCheck } from './../functions/printFiscalCheck'

const fs = require("fs");
const remote = require('electron').remote;
const application = remote.app;
const mainAppPath = application.getAppPath().replace('\\app.asar', '') 
const pythonPath = mainAppPath + '\\atol_python\\python\\python.exe'
const pythonScriptPath = mainAppPath + '\\atol_python'
export default {
    name: 'fiscal-printer',
    props: [ 'print', 'summ', 'getFromCustomer', 'checkType', 'items', 'taxationType', 'paymentType'],
    data() {
        return {
          
        }
    },
    created() {
     
  
    },
    computed: {
      currentFiscalPrinter() {
        return this.$store.getters['equipment/currentFiscalPrinter']
      },
      currentUser() {
        return this.$store.state.users.currentUser
      },
    },
    watch: {
      'print': function () {
        let app = this 
        if (this.print) {
          console.log("печать чека")
          app.printCheck()
          
        }
        
      }
    },
    methods: {
      printCheck() {

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

  
         fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check), function (err) {})            
      

         printFiscalCheck(app.pythonShellOptionsPRO(JSON.stringify(check))).then(result => {
           console.log(result)
             app.$emit('checkPrinted', result)
           
           
          })
          //fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check), function (err) {})
       

       /* if (way == "electronically") {

          check.payments[0] =  {
            "type": "electronically",
            "sum": Number(Number(app.summ).toFixed(2))
          }
          let nonFiscalCheck = {}
          nonFiscalCheck.type = "nonFiscal"
          nonFiscalCheck.items = []
          
          nonFiscalCheck.items.push({
              type: "text",
              text: "ООО Рога и Копыты",
              alignment: "center"
          })
          check.items.forEach(element => {
            nonFiscalCheck.items.push({
              type: "text",
              text: '---------------------------',
              alignment: "center"
            })
            nonFiscalCheck.items.push({
              type: "text",
              text: element.name,
            })
            nonFiscalCheck.items.push({
              type: "text",
              text: element.price.toFixed(2) + " x " + element.quantity,
            })
            nonFiscalCheck.items.push({
              type: "text",
              text: " = " + Number(element.quantity*element.price).toFixed(2),
              alignment: "right"
            })          
          });
          nonFiscalCheck.items.push({
              type: "text",
              text: '---------------------------',
              alignment: "center"
          })
          nonFiscalCheck.items.push({
              type: "text",
              text: 'Итого:   '+ Number(app.summ).toFixed(2)
          })
          nonFiscalCheck.items.push({
              type: "text",
              text: 'Ждем вас снова!',
              alignment: "center"
          })
          
          printNoFiscalCheck(app.pythonShellOptionsDEV(JSON.stringify(nonFiscalCheck))).then(result => {
            app.alert = result
          })
          //fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check), function (err) {})
        } else if (way == "cash"){
          if (isNaN(Number(app.getFromCustomer))) {
            
          } else {
            if (app.getFromCustomer == "") {
              
              check.payments[0] =  {
                "type": "cash",
                "sum":  Number(Number(app.summ).toFixed(2))
              }

              check = {}
              check.type = "reportX"
          

              printNoFiscalCheck(app.pythonShellOptionsDEV(JSON.stringify(check))).then(result => {
                app.alert = result
              })
            // fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check), function (err) {})            
            } else if (Number(app.getFromCustomer) >= Number(app.summ)) {
              console.log('yes')
              check.payments[0] =  {
                "type": "cash",
                "sum":  Number(Number(app.getFromCustomer).toFixed(2))
              }
              check = {}
              check.type = "reportX"
          
              printNoFiscalCheck(app.pythonShellOptionsDEV(check)).then(result => {
                app.alert = result
              })
            // fs.appendFile(application.getPath('userData') + "/logs/checks.txt", new Date().toLocaleString().replace(/:/g, '-') + " JSON: " + JSON.stringify(check), function (err) {})         
            }  
                       
          }  
        }*/
      },
      pythonShellOptionsDEV(task) {
      let app = this
      console.log(task)
      return {
        mode: 'text',
        pythonPath: 'atol_python/python/python.exe',
        pythonOptions: ['-u'],
        scriptPath: 'atol_python',
        args: [
          app.currentFiscalPrinter.settings.model, app.currentFiscalPrinter.settings.connection, app.currentFiscalPrinter.settings.comFile, 
          app.currentFiscalPrinter.settings.baudRate, app.currentFiscalPrinter.settings.IPAddress, app.currentFiscalPrinter.settings.IPPort, task
        ] 
      }
    },
    pythonShellOptionsPRO(task) {
      let app = this
      return {
        mode: 'text',
        pythonPath: pythonPath,
        pythonOptions: ['-u'],
        scriptPath: pythonScriptPath,
        args: [
          app.currentFiscalPrinter.settings.model, app.currentFiscalPrinter.settings.connection, app.currentFiscalPrinter.settings.comFile, 
          app.currentFiscalPrinter.settings.baudRate, app.currentFiscalPrinter.settings.IPAddress, app.currentFiscalPrinter.settings.IPPort, task
        ]
      }
    }
    }
    
}
</script>