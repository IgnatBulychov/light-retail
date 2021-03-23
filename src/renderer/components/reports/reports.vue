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

    <fiscal-printer 
      @check-printed="checkWasPrinted" 
      :print="print" 
      :printOpenShift="printOpenShift"
      :printReportX="printReportX"
      :printCloseShift="printCloseShift"
      :printCashIn="printCashIn"
      :printCashOut="printCashOut"
    />

  </div>
</template>

<script>
import FiscalPrinter from '../equipment/fiscal-printer'
export default {
name: 'reports',
components: {
  Alert, FiscalPrinter
},
data() {
  return {
    loading: false,
    printOpenShift:false,
    printReportX:false,
    printCloseShift:false,
    printCashIn: false,
    printCashOut: false,
    alert: {
      show: false,
      timeout: 3000,
      type: "error",
      text: ''
    }
  }
},
mounted() {
  
},
destroyed() {

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
  checkWasPrinted() {

  },
  openShift() {
      
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



          