<template>
    <div height="100%" width="100%" class="mx-2 my-2">
     
        <v-btn @click="openShift()" class="ma-2" tile color="success">
         <v-icon>mdi-clipboard-arrow-up-outline</v-icon> Открыть смену
        </v-btn>
        <br>
        <v-btn @click="reportX()" class="ma-2" tile color="success">
            <v-icon>mdi-clipboard-arrow-right-outline</v-icon> Промежуточный отчет (X-отчет)
        </v-btn> 
        <br>
        <v-btn @click="reportZ()" class="ma-2" tile color="success">
            <v-icon>mdi-clipboard-arrow-down-outline</v-icon> Закрытие смены (Z-отчет)
        </v-btn> 


        
        <alert :alert="alert" :timeout="5000" />


  </div>
</template>

<script>
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
    alert: {
      show: false,
      text: ''
    }
  }
},
created() {
  this.$store.dispatch('fiscalRegisters/setCurrentFRSettings')
},
computed: {
  fr() {
    return this.$store.state.fiscalRegisters.currentFRSettings
  }
},
methods: {
  reportX() {
    this.makeJsonTask(`{
        "type": "reportX"
    }`) 
  },
  makeJsonTask(task) {
    let app = this

    let options = {
      mode: 'text',
      pythonPath: 'atol_python/python/python.exe',
      pythonOptions: ['-u'],
      scriptPath: 'atol_python',
      args: [app.fr.settings.model, app.fr.settings.connection, app.fr.settings.comFile, 
      app.fr.settings.baudRate, app.fr.settings.IPAddress, app.fr.settings.IPPort,
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
    if (results[0] == 'connectionFailed') {
      app.alert.show = true
      app.alert.text = 'Нет связи с кассой'
    } else if (results[0] == 'error') {
      app.alert.show = true
      app.alert.text = 'Неверная команда'
    } else if (results[0] == '""') {
      app.alert.show = true
      app.alert.text = 'Операция выполнена'
    } else {
      app.alert.show = true
      app.alert.text = 'Операция выполнена'
    }
  });    
}
}
}
</script>

<style>
  
</style>



          