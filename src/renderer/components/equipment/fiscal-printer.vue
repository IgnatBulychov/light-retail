<template>
    
</template>
<script>


import { getEquipmentFromBase } from '../../store/dbAPI/equipment/getEquipment'
const w = require('node-atol-wrapper');
const fptr = new w.Fptr10();



export default {
    name: 'fiscal-printer',
    props: [ 'print', 'summ', 'getFromCustomer', 'checkType', 'items', 'taxationType', 'paymentType'],
    data() {
        return {
          settings: { 
              AccessPassword: '',
                AutoDisableBluetooth: false,
                AutoEnableBluetooth: true,
                BaudRate: 115200,
                Bits: 8,
                ComFile: '1',
                IPAddress: '192.168.1.10',
                IPPort: 5555,
                LibraryPath: '',
                MACAddress: 'FF:FF:FF:FF:FF:FF',
                Model: 500,
                OfdChannel: 0,
                Parity: 0,
                Port: 0,
                StopBits: 0,
                UsbDevicePath: 'auto',
                UserPassword: '' 
            }
        }
    },
    created() {
     
fptr.create();
this.settings = fptr.getSettings();
  console.log('getSettings', this.settings);
this.settings.Port = 0;  // ComPort communication
// settings.ComFile = '/dev/ttyACM0'; //ComPort name
this.settings.ComFile = 'COM4';  // ComPort name
this.settings.BaudRate = 115200;
console.log('setSettings', fptr.setSettings(this.settings));
console.log('isOpened', fptr.isOpened());
console.log('open', fptr.open());
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
      

         printFiscalCheck(JSON.stringify(check)).then(result => {
           console.log(result)
             app.$emit('checkPrinted', result)
           
           
          })
        }
    }
}
</script>