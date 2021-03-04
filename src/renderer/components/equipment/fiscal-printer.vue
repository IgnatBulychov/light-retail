<template>
  <div>
    <alert :alert="alert"/>
    <atol-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Атол'"
      @checkPrinted="checkPrinted" 
      :printAtol="printAtol" 
      :summ="summ" 
      :paymentType="paymentType" 
      :getFromCustomer="getFromCustomer" 
    />
    <merc-fiscal-printer 
      v-if="currentFiscalPrinterModel == 'Меркурий'" 
      @checkPrinted="checkPrinted" 
      :printMerc="printMerc" 
      :summ="summ" 
      :paymentType="paymentType" 
      :getFromCustomer="getFromCustomer" 
    />
  </div>
</template>
<script>

import Alert from '../alerts/alert'
import AtolFiscalPrinter from './atol-fiscal-printer.vue'
import MercFiscalPrinter from './merc-fiscal-printer.vue'
export default {
    name: 'fiscal-printer',
    props: [ 'print', 'summ', 'getFromCustomer', 'paymentType'],
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
      'print': function () {
        let app = this 
        if (this.print) {
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
        this.$emit('checkPrinted',result )
      }
    }
}
</script>