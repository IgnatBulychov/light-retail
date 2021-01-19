<template>
    <div height="100%" width="100%" class="mx-2 my-2">
        <v-btn @click="openShift()" class="ma-2" tile color="success" :loading="openShiftLodaing" :disabled="reportXLodaing || closeShiftLodaing">
         <v-icon>mdi-clipboard-arrow-up-outline</v-icon> Открыть смену
        </v-btn>
        <br>
        <v-btn @click="reportX()" class="ma-2" tile color="success" :loading="reportXLodaing" :disabled="openShiftLodaing || closeShiftLodaing">
            <v-icon>mdi-clipboard-arrow-right-outline</v-icon> Промежуточный отчет (X-отчет)
        </v-btn> 
        <br>
        <v-btn @click="closeShift()" class="ma-2" tile color="success" :loading="closeShiftLodaing" :disabled="openShiftLodaing || reportXLodaing">
            <v-icon>mdi-clipboard-arrow-down-outline</v-icon> Закрытие смены (Z-отчет)
        </v-btn> 
        <alert :alert="alert" />
  </div>
</template>

<script>
const fs = require("fs");
import Alert from '../alerts/alert.vue'
const remote = require('electron').remote;
const application = remote.app;

const mainAppPath = application.getAppPath().replace('\\app.asar', '') 

const pythonPath = mainAppPath + '\\atol_python\\python\\python.exe'
const pythonScriptPath = mainAppPath + '\\atol_python'

let {PythonShell} = require('python-shell')

export default {
name: 'reports',
components: {
  Alert
},
data() {
  return {
    openShiftLodaing: false,
    closeShiftLodaing: false,
    reportXLodaing: false,
    alert: {
      show: false,
      timeout: 3000,
      type: "error",
      text: ''
    }
  }
},
mounted() {
  this.$store.dispatch('settings/getSettings')
},
computed: {
  currentFiscalPrinter() {
    return this.$store.getters['equipment/currentFiscalPrinter']
  },
  currentUser() {
    return this.$store.state.users.currentUser
  }
},
methods: {
  openShift() {
    let app = this
    app.openShiftLodaing = true
    let task = {}
    task.type = "openShift"
    task.operator = {}
    task.operator.name = app.currentUser.name
    if (task.operator.vatin) {
      task.operator.vatin = app.currentUser.vatin
    }
    this.makeJsonTask(JSON.stringify(task)) 
    fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-openShift.log", task)
  },
  reportX() {
    let app = this
    app.reportXLodaing = true
    let task = {}
    task.type = "reportX"
    task.operator = {}
    task.operator.name = app.currentUser.name
    if (task.operator.vatin) {
      task.operator.vatin = app.currentUser.vatin
    }
    this.makeJsonTask(JSON.stringify(task)) 
    fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-reportX.log", task)
  },
  closeShift() {
    let app = this
    app.closeShiftLodaing = true
    let task = {}
    task.type = "closeShift"
    task.operator = {}
    task.operator.name = app.currentUser.name
    if (task.operator.vatin) {
      task.operator.vatin = app.currentUser.vatin
    }
    this.makeJsonTask(JSON.stringify(task)) 
    fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-closeShift.log", task)
  },
  stopLoading() {
    this.openShiftLodaing = false
    this.closeShiftLodaing = false
    this.reportXLodaing = false
  },
  makeJsonTask(task) {
    let app = this    
    console.log(pythonScriptPath)
    console.log(pythonPath)
    let options = app.pythonShellOptionsPRO(task)
    console.log(options)
    PythonShell.run('json_task.py', options, function (err, results) {
      if (err) throw err;

      if (results[0] == 'connectionFailed') {
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Нет связи с кассой'
        }
        app.stopLoading()
      } else if (results[0] == 'error') {
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Неверная команда'
        }
        app.stopLoading()
      } else if (results[0] == '""') {
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Операция выполнена'
        }
        app.stopLoading()
      } else {
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Операция выполнена'
        }
        app.stopLoading()
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

<style>
  
</style>



          