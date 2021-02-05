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
const w = require('node-atol-wrapper');
const fptr = new w.Fptr10();
const remote = require('electron').remote;
const application = remote.app;


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
destroyed() {
      fptr.close()
      fptr.destroy()
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
    app.reportXLodaing = true
    let task = {}
    task.type = "openShift"
    task.operator = {}
    task.operator.name = app.currentUser.name
    if (task.operator.vatin) {
      task.operator.vatin = app.currentUser.vatin
    }
    fptr.processJsonAsync(
    task,
    (err, result) => {
      if (err) {
        app.reportXLodaing = false
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Нет связи с кассой'
        }
        fptr.close()   
        throw err;
      } else {
        app.reportXLodaing = false
        console.log('reportX', result);  
        app.alert = {
          show: true,
          timeout: 3000,
          type: "success",
          text: 'Операция выполнена'
        }
        fptr.close()      
      }
    });
    
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
    fptr.processJsonAsync(
    task,
    (err, result) => {
      if (err) {
        app.reportXLodaing = false
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Нет связи с кассой'
        }
        fptr.close()   
        throw err;
      } else {
        app.reportXLodaing = false
        app.alert = {
          show: true,
          timeout: 3000,
          type: "success",
          text: 'Операция выполнена'
        } 
        fptr.close()   
        console.log('reportX', result);        
      }
    });
    fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-reportX.log", task)
  },
  closeShift() {
     let app = this
    app.reportXLodaing = true
    let task = {}
    task.type = "closeShift"
    task.operator = {}
    task.operator.name = app.currentUser.name
    if (task.operator.vatin) {
      task.operator.vatin = app.currentUser.vatin
    }
    fptr.processJsonAsync(
    task,
    (err, result) => {
      if (err) {
        app.reportXLodaing = false
        app.alert = {
          show: true,
          timeout: 3000,
          type: "error",
          text: 'Нет связи с кассой'
        }
        fptr.close()   
        throw err;
      } else {
        app.reportXLodaing = false
        app.alert = {
          show: true,
          timeout: 3000,
          type: "success",
          text: 'Операция выполнена'
        } 
        fptr.close()   
        console.log('closeShift', result);        
      }
    });
    fs.writeFileSync(application.getPath('userData') + "/logs/" + new Date().toLocaleString().replace(/:/g, '-') + "-closeShift.log", task)
  },
  stopLoading() {
    this.openShiftLodaing = false
    this.closeShiftLodaing = false
    this.reportXLodaing = false
  }
}
}
</script>

<style>
  
</style>



          