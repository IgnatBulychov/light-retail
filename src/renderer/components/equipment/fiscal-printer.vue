<template>
  <div>
    <alert :alert="alert"/>
    <atol-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Атол'"
      @check-printed-atol="checkPrinted" 
      :printAtol="printAtol" 
      :summ="summ" 
      :paymentType="paymentType" 
      :getFromCustomer="getFromCustomer" 

      :printOpenShiftAtol="printOpenShift"
      :printReportXAtol="printReportX"
      :printCloseShiftAtol="printCloseShift"
      :printCashInAtol="printCashIn"
      :printCashOutAtol="printCashOut"
    />
    <merc-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Меркурий'" 
      @check-printed-merk="checkPrinted" 
      :printMerc="printMerc" 
      :summ="summ" 
      :paymentType="paymentType" 
      :getFromCustomer="getFromCustomer" 

      :printOpenShiftMerk="printOpenShift"
      :printReportXMerk="printReportX"
      :printCloseShiftMerk="printCloseShift"
      :printCashInMerk="printCashIn"
      :printCashOutMerk="printCashOut"
    />
  </div>
</template>
<script>

import Alert from '../alerts/alert'
import AtolFiscalPrinter from './atol-fiscal-printer.vue'
import MercFiscalPrinter from './merc-fiscal-printer.vue'
export default {
    name: 'fiscal-printer',
    props:  [
             'print', 'summ', 'getFromCustomer', 'paymentType',
             'printOpenShift','printReportX','printCloseShift','printCashIn','printCashOut',
            ],
    components: {
      Alert, AtolFiscalPrinter, MercFiscalPrinter
    },
    data() {
        return {
          alert: {
            show: false,
            timeout: 2000,
            type: "success",
            text: ''
          },
          printAtol: false,
          printMerc: false
        }
    },
    created() {
      
      if (this.currentFiscalPrinter) {
        
      } else {
        this.alert = {
          show: true,
            timeout: 2000,
            type: "error",
            text: 'Фискальный регистратор не настроен'
        }
      }      
    },
    computed: {
      printCheck() {
        return this.print
      },
      currentFiscalPrinter() {
        return this.$store.getters['equipment/currentFiscalPrinter']
      },
      currentFiscalPrinterModel() {
        if (this.currentFiscalPrinter) {
          return this.currentFiscalPrinter.model
        } else {
          return null
        }
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
      'printCheck': function () {
        console.log('9', this.printCheck)
        let app = this 
        if (this.printCheck) {
          console.log("печать чека")
          if (this.currentFiscalPrinterModel == "Атол") {
            app.printAtol = true
             console.log("печать чека атол")
          } else if (this.currentFiscalPrinterModel == "Меркурий") {
            app.printMerc = true
              console.log("печать чека меркурий")
          }          
        }
      }
    },
    methods: {
      checkPrinted(result) {
        this.$emit('check-printed',result )
        this.printAtol = false
        this.printMerc = false
      }
    }
}
</script>