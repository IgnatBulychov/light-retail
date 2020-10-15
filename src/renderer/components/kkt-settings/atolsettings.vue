<template>
  <v-card>
    <v-card-title> Настройки </v-card-title>
    <v-card-text>
      <v-container>
      <v-row>
        <v-col
          cols="6"
        >
          <v-select
            :items="models"
            v-model="settings.model"
            label="Модель ККТ"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-select
            :items="connections"
            v-model="settings.connection"
            label="Тип соеединения"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-select
            :items="comPorts"
            v-model="settings.comFile"
            label="COM-порт"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-select
            :items="baudrates"
            v-model="settings.baudRate"
            label="Скорость"
          ></v-select>
        </v-col>
        <v-col
          cols="6"
        >
          <v-text-field
              v-model="settings.IPAddress"
              label="IP адрес"
          ></v-text-field>
        </v-col>
        <v-col
          cols="6"
        >
          <v-text-field
              v-model="settings.IPPort"
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
    name: 'atolsettings',
    data() {
      return {
        models: models,
        connections: connections,
        baudrates: baudrates,
        comPorts: comPorts,

        settings:  {
            model: 'LIBFPTR_MODEL_ATOL_AUTO',  
            connection: 'LIBFPTR_PORT_TCPIP',
            comFile: "COM1",
            baudRate: 'LIBFPTR_PORT_BR_115200', 
            IPAddress: "192.168.0.13", 
            IPPort: 5555,            
        },

        serial: 0,
        error: '',
        success: '',

        loading: false,
      }
    },
    mounted() {
       let app = this
        app.success = ''
        app.error = ''
        PythonShell.run('driver_version.py', app.pythonShellOptionsDEV, function (err, results) {
          if (err) throw err;
          console.log(results);
         
        });

    },
    computed: {
      pythonShellOptionsDEV() {
        let app = this
        return {
          mode: 'text',
          pythonPath: 'atol_python/python/python.exe',
          pythonOptions: ['-u'],
          scriptPath: 'atol_python',
          args: [app.settings.model, app.settings.connection, app.settings.comFile, 
          app.settings.baudRate, app.settings.IPAddress, app.settings.IPPort,
          ] 
        }
      },
      pythonShellOptionsPRO() {
        let app = this
        return {
            mode: 'text',
            pythonPath: pythonPath,
            pythonOptions: ['-u'],
            scriptPath: pythonScriptPath,
            args: [app.settings.model, app.settings.connection, app.settings.comFile, 
            app.settings.baudRate, app.settings.IPAddress, app.settings.IPPort,
            ] 
        }
      }
    },
    methods: {
      makeJsonTask(task) {
        let app = this
        app.success = ''
        app.error = ''
        let options = {
          mode: 'text',
          pythonPath: 'atol_python/python/python.exe',
          pythonOptions: ['-u'],
          scriptPath: 'atol_python',
          args: [app.settings.model, app.settings.connection, app.settings.comFile, 
          app.settings.baudRate, app.settings.IPAddress, app.settings.IPPort,
          task] 
        }

        /* PRODUCTION
         let options = {
          mode: 'text',
          pythonPath: pythonPath,
          pythonOptions: ['-u'],
          scriptPath: pythonScriptPath,
          args: [app.settings.model, app.settings.connection, app.settings.comFile, 
          app.settings.baudRate, app.settings.IPAddress, app.settings.IPPort,
          task] 
        }
        */

        PythonShell.run('json_task.py', options, function (err, results) {
          if (err) throw err;
          
          console.log(results)
          /*if (results[0] == 'connectionFailed') {
            console.log('Ошибка обмена')
          } else if (results[0] == 'error') {
            console.log('Запрос не может быть выполнен')
          } else if (results[0] == '""') {
             console.log("Метод ничего не возвращает...скорее всего всё в порядке...")
          } else {
            console.log('неизвестная ошибка')
          }*/
        });
           
      },
      connectionTest () {  

        let app = this
app.loading = true
        app.success = ''
        app.error = ''
        let options = {
              mode: 'text',
              pythonPath: 'atol_python/python/python.exe',
              pythonOptions: ['-u'],
              scriptPath: 'atol_python',
              args: [
                app.settings.model, 
                app.settings.connection, 
                app.settings.comFile, 
                app.settings.baudRate,
                app.settings.IPAddress, 
                app.settings.IPPort,
                '{"type":"getDeviceInfo"}'
              ] 
            }

            PythonShell.run('json_task.py', options, function (err, results) {
console.log(results)
app.loading = false
              if (results[0] == 'connectionFailed') {
             app.error = 'Нет связи с кассой'
              }  else if (results[0] == 'error') {
  app.error = 'Неверная команда'
              }             
              else {
              app.serial = JSON.parse(JSON.parse(results[0])).deviceInfo.serial
              
              app.success = `Связь с ККТ ${JSON.parse(JSON.parse(results[0])).deviceInfo.serial} установлена` 
            
              }

              
            });
/*
        PythonShell.run('connection_test.py', app.pythonShellOptionsDEV, function (err, results) {
          if (err) throw err;
          
          console.log(results[0]);
          
          if (results[0] == 1) {
            
            


          } else {
            app.error = 'Нет связи'
          }
        });*/

      },
      storeSettings() {
        let app = this
        this.$store.dispatch('fiscalRegisters/addFiscalRegister', [ app.settings, app.serial ])
        this.$emit('selected')  
        this.error = ''
        this.success = ''
      },
      getDeviceInfo() {
        let app = this
        let task = '{"type":"getDeviceInfo"}'
        app.makeJsonTask(task) 
      },
      connectionSuccess() {
        
        let app = this
        app.success = ''
        app.error = ''
        let task = `{
          "type": "nonFiscal",
          "items": [
                      {
                          "type": "text",
                          "text": " ",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": "Получилось!!! (*_*)",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": "(установить связь)",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": " ",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": " ",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": " ",
                          "alignment": "center"
                      },
                      {
                          "type": "text",
                          "text": " ",
                          "alignment": "center"
                      }
                    ]
                  }`
        app.makeJsonTask(task) 
      }
      
  }
 }


  /*
  Работает
      getSettings () {  
        let app = this
        PythonShell.run('get_settings.py', app.pythonShellOptionsDEV, function (err, results) {
          if (err) throw err;
          console.log(JSON.parse(results[0]));
          app.log1 = JSON.parse(results[0])
        });
      },
      setSettings () {  
        let app = this
        PythonShell.run('set_settings.py', app.pythonShellOptionsDEV, function (err, results) {
          if (err) throw err;
          console.log(results[0]);
          app.log1 = results[0]
        });
      },
  getDeviceInfo() {
        let app = this
        let task = '{"type":"getDeviceInfo"}'
        app.makeJsonTask(task) 
      },
      reportX() {
        let app = this
        let task = '{"type":"reportX","operator":{"name":"Админ","vatin":"123654789507"}}'
        app.makeJsonTask(task) 
      },
      about() {
        let app = this
        let task = `{
            "type": "getShiftStatus"
           }`
        app.makeJsonTask(task) 
      },
          {"type":"getDeviceParameters","keys": [273, 274, 9999, 49, 50]}
          {"type": "getDeviceStatus"}
          `{
            "type": "getShiftStatus"
           }`
           */
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