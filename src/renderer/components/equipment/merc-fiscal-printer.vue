<template>
<alert :alert="alert" />
</template>
<script>

import axios from 'axios'
import Alert from '../alerts/alert'
export default {
    name: 'merc-fiscal-printer',
    props: [ 'printMerc', 'summ', 'getFromCustomer', 'paymentType'],
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
      'printMerc': function () {
        let app = this 
          console.log("печать чека Меркурий")
          app.printCheck()
        
      }
    },
    methods: {
      printCheck() {
        let app = this

      var query = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.currentFiscalPrinter.settings.comFile,
        baudRate: app.currentFiscalPrinter.settings.baudRate,
        model: app.currentFiscalPrinter.settings.model
      }
        
      axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

      axios.post('http://localhost:50010/api.json', JSON.stringify(query))
      .then(function (response) {
          if (response.data.result != 0) {
             app.alert = {
              type: 'error',
              show: true,
              text: response.data.description,
              timeout: 5000
            }
          } else if (response.data.result == 0) {
            axios.post('http://localhost:50010/api.json', 
              JSON.stringify({
                sessionKey: response.data.sessionKey,
                command: "GetCommonInfo"
              })
            )
            .then(function (response) {
                app.alert = {
                    type: 'error',
                    show: true,
                    text: "Связь с ККТ № " + response.data.kktNum + " установлена",
                    timeout: 5000
                }
                axios.post('http://localhost:50010/api.json', 
                  JSON.stringify({
                    sessionKey: response.data.sessionKey,
                    command: "CloseSession"
                  })
                )
            })
          }
          console.log(response);
        })

        this.$emit('checkPrinted', {
              show: true,
              timeout: 3000,
              type: "success",
              text: 'Операция выполнена'
            })     

      }
    }
}
</script>