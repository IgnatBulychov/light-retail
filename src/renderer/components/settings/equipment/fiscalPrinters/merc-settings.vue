<template>
  <v-card>
    <v-card-title> Настройки </v-card-title>
    <v-card-text>
      <v-container>
      <v-row>
         <v-col cols="6">
          <v-select
            :items="models"
            v-model="fiscalPrinter.settings.model"
            label="Модель"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="comPorts"
            v-model="fiscalPrinter.settings.comFile"
            label="COM-порт"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="baudrates"
            v-model="fiscalPrinter.settings.baudRate"
            label="Скорость"
          ></v-select>
        </v-col>
        
        <v-col cols="6">
          
        </v-col>
      </v-row>
    </v-container>
    
    <v-card-actions>
      <v-btn
        class="ma-2"
        color="blue lighten-1" text
        @click="connectionTest"
      >
      Проверить связь
      </v-btn>     
      <v-spacer></v-spacer>     
      <v-btn color="green darken-5" class="text-center" text @click="storeSettings">Добавить кассу</v-btn>
    </v-card-actions>

    </v-card-text>

 <alert :alert="alert"/>

  </v-card>
</template>

<script>
import Alert from '../../../alerts/alert'
import models from './resources-merc/models.js'
import baudrates from './resources-merc/baudrates.js'
import comPorts from './resources-merc/comPorts.js'
import axios from 'axios'
export default {
  name: 'merc-settings',
  components: {
    Alert
  },
  data() {
    return {
      models: models,
      baudrates: baudrates,
      comPorts: comPorts,
      fiscalPrinter:{
        model: "Меркурий",
        active: true,
        settings:  {
          model: '185F',  
          comFile: "COM1",
          baudRate: 115200    
        },
        serial: 0,
        type: 'Фискальный регистратор',
      },   
      settings: {},   
      alert: {
        type: 'success',
        show: false,
        text: '',
        timeout: 3000
      }
    }
  },
  computed: {
    
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
  methods: {
    connectionTest() {
     let app = this

      var query = {
        sessionKey: null,
        command: "OpenSession",
        portName: app.fiscalPrinter.settings.comFile,
        baudRate: app.fiscalPrinter.settings.baudRate,
        model: app.fiscalPrinter.settings.model
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
    },
    storeSettings() {
      let app = this
      this.$emit('save-fiscal-printer', app.fiscalPrinter )  
     this.alert = {
        type: 'success',
        show: false,
        text: '',
        timeout: 3000
      }
    }      
  }
}

</script>

<style scopped>

</style>