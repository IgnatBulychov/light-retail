<template>
  <v-card>
    <v-card-title> Настройки </v-card-title>
    <v-card-text>
      <v-container>
      <v-row>
        <v-col cols="6">
          <v-select
            :items="connections"
            v-model="fiscalPrinter.settings.connection"
            label="Тип соединения"
          ></v-select>
        </v-col>
         <v-col cols="6">
          
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
          <v-text-field
            v-model="fiscalPrinter.settings.IPAddress"
            label="IP адрес"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fiscalPrinter.settings.IPPort"
            label="Порт"
          ></v-text-field>
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
import models from './resources-atol/models.js'
import connections from './resources-atol/connections.js'
import baudrates from './resources-atol/baudrates.js'
import comPorts from './resources-atol/comPorts.js'
const w = require('node-atol-wrapper');
const fptr = new w.Fptr10();

export default {
  name: 'atol-settings',
  components: {
    Alert
  },
  data() {
    return {
      models: models,
      connections: connections,
      baudrates: baudrates,
      comPorts: comPorts,
      fiscalPrinter:{
        model: "Атол",
        active: true,
        settings:  {
          //model: 'LIBFPTR_MODEL_ATOL_AUTO',  
          connection: 0,
          comFile: "COM1",
          baudRate: 115200, 
          IPAddress: "192.168.0.13", 
          IPPort: 5555,            
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
     
fptr.create();
this.settings = fptr.getSettings();
  console.log('getSettings', this.settings);

    },
  methods: {
    connectionTest () {  
      let app = this
     
     this.settings.Port = this.fiscalPrinter.settings.connection;  // ComPort communication
// settings.ComFile = '/dev/ttyACM0'; //ComPort name
this.settings.ComFile = this.fiscalPrinter.settings.comFile;  // ComPort name
this.settings.BaudRate = this.fiscalPrinter.settings.baudRate;
this.settings.IPAddress = this.fiscalPrinter.settings.IPAddress;
this.settings.IPPort = this.fiscalPrinter.settings.IPPort;
console.log('setSettings', fptr.setSettings(this.settings));
 console.log('getSettings',fptr.getSettings());

  //  console.log('open', fptr.open());
   
/*
fptr.processJsonAsync(
    {type: 'reportX', operator: {name: 'Иванов', vatin: '123654789507'}},
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log('reportX', result);
        fptr.processJsonAsync({type: 'getDeviceStatus'}, (err, result) => {
          if (err) {
            throw err;
          } else {
            console.log('getDeviceStatus', result);
            console.log('close', fptr.close());
          }
        })
      }
    });
*/

      if (fptr.isOpened()) {
        if (fptr.open()) {
          this.alert = {
            type: 'success',
            show: true,
            text: 'Связь установлена',
            timeout: 3000
          }
        } else {
           this.alert = {
            type: 'error',
            show: true,
            text: 'Нет связи с ККТ, проверьте настройки',
            timeout: 3000
          }
        } 
      } else {
          this.alert = {
            type: 'error',
            show: true,
            text: 'Нет связи с ККТ, проверьте настройки',
            timeout: 3000
          }
      }
       
  
       
       
      /*    app.error = 'Нет связи с кассой'
       
          app.error = 'Неверная команда'
       
          app.serial = JSON.parse(JSON.parse(results[0])).deviceInfo.serial
          app.success = `Связь с ККТ ${JSON.parse(JSON.parse(results[0])).deviceInfo.serial} установлена` */
        
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