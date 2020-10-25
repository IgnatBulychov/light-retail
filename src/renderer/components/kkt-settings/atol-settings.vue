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
            label="Модель ККТ"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="connections"
            v-model="fiscalPrinter.settings.connection"
            label="Тип соеединения"
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
        :loading="loading"
        :disabled="loading"
        color="blue lighten-1" text
        @click="connectionTest"
      >
      Проверить связь
      </v-btn>     
      <v-spacer></v-spacer>     
      <v-btn color="green darken-5" class="text-center" text @click="storeSettings">Добавить кассу</v-btn>
    </v-card-actions>

    <v-alert 
      v-if="error"
      type="error"
      dense
      text
    > {{ error }}       
    </v-alert>

    <v-alert 
      v-if="success"
      type="success" 
      dense
      text
    > {{ success }}  
    </v-alert>

    </v-card-text>
  </v-card>
</template>

<script>
import models from './resources-atol/models.js'
import connections from './resources-atol/connections.js'
import baudrates from './resources-atol/baudrates.js'
import comPorts from './resources-atol/comPorts.js'

const remote = require('electron').remote;
const application = remote.app;

const mainAppPath = application.getAppPath().replace('\\app.asar', '') 

const pythonPath = mainAppPath + '\\atol_python\\python\\python.exe'
const pythonScriptPath = mainAppPath + '\\atol_python'

let {PythonShell} = require('python-shell')

export default {
  name: 'atol-settings',
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
          model: 'LIBFPTR_MODEL_ATOL_AUTO',  
          connection: 'LIBFPTR_PORT_TCPIP',
          comFile: "COM1",
          baudRate: 'LIBFPTR_PORT_BR_115200', 
          IPAddress: "192.168.0.13", 
          IPPort: 5555,            
        },
        serial: 0,
      },      
      error: '',
      success: '',
      loading: false,
    }
  },
  computed: {
    
  },
  methods: {
    connectionTest () {  
      let app = this
      app.loading = true
      app.success = ''
      app.error = ''
      let options = app.pythonShellOptionsDEV('{"type":"getDeviceInfo"}')
      PythonShell.run('json_task.py', options, function (err, results) {          
        app.loading = false
        if (results[0] == 'connectionFailed') {
          app.error = 'Нет связи с кассой'
        }  else if (results[0] == 'error') {
          app.error = 'Неверная команда'
        } else {
          app.serial = JSON.parse(JSON.parse(results[0])).deviceInfo.serial
          app.success = `Связь с ККТ ${JSON.parse(JSON.parse(results[0])).deviceInfo.serial} установлена` 
        }
      });
    },
    pythonShellOptionsDEV(task) {
      let app = this
      return {
        mode: 'text',
        pythonPath: 'atol_python/python/python.exe',
        pythonOptions: ['-u'],
        scriptPath: 'atol_python',
        args: [
          app.fiscalPrinter.settings.model, app.fiscalPrinter.settings.connection, app.fiscalPrinter.settings.comFile, 
          app.fiscalPrinter.settings.baudRate, app.fiscalPrinter.settings.IPAddress, app.fiscalPrinter.settings.IPPort, task
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
            app.fiscalPrinter.settings.model, app.fiscalPrinter.settings.connection, app.fiscalPrinter.settings.comFile, 
            app.fiscalPrinter.settings.baudRate, app.fiscalPrinter.settings.IPAddress, app.fiscalPrinter.settings.IPPort, task
          ] 
      }
    },
    storeSettings() {
      let app = this
      this.$emit('save-fiscal-printer', app.fiscalPrinter )  
      this.error = ''
      this.success = ''
    }      
  }
}

</script>


<style scopped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>