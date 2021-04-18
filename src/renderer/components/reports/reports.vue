<template>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-text>
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  color="green"
                ></v-progress-linear>
                <br>
                  <v-btn @click="openShift()" class="ma-2" tile color="success" :disabled="loading">
                  <v-icon>mdi-clipboard-arrow-up-outline</v-icon> Открыть смену
                  </v-btn>
                  <br>
                  <v-btn @click="reportX()" class="ma-2" tile color="success" :disabled="loading">
                      <v-icon>mdi-clipboard-arrow-right-outline</v-icon> Промежуточный отчет (X-отчет)
                  </v-btn> 
                  <br>
                  <v-btn @click="closeShift()" class="ma-2" tile color="success" :disabled="loading">
                      <v-icon>mdi-clipboard-arrow-down-outline</v-icon> Закрытие смены (Z-отчет)
                  </v-btn> 
                  <v-card>
                    <v-card-text>
                      <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                      >
                        <v-text-field v-model="cash" :rules="cashRules" label="Введите сумму наличных"  outlined > </v-text-field>                
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                    
                        <v-btn @click="cashIn()" class="ma-2" tile color="primary" :disabled="loading">
                            <v-icon>mdi-clipboard-arrow-down-outline</v-icon> Внести в кассу
                        </v-btn> 
                        <v-spacer></v-spacer>
                        <v-btn @click="cashOut()" class="ma-2" tile color="info" :disabled="loading">
                            <v-icon>mdi-clipboard-arrow-up-outline</v-icon> Изъять из кассы
                        </v-btn> 
                    </v-card-actions>
                  </v-card>
              </v-card-text>
            </v-card>
              <alert :alert="alert" />

          <fiscal-printer 
            @check-printed="checkWasPrinted" 
            :print="print"
            :cash="cash"
          />

 
          </v-col>
                   </v-row>
            </v-container>
</template>

<script>
import FiscalPrinter from '../equipment/fiscal-printer'
export default {
name: 'reports',
components: {
  FiscalPrinter
},
data() {
  return {
    valid: true,
    loading: false,
    cash: "",
    print:{
      openShift: false,
      reportX: false,
      closeShift: false,
      cashIn: false,
      cashOut: false
    },
    alert: {
      show: false,
      timeout: 3000,
      type: "error",
      text: ''
    }
  }
},
computed: {
  currentFiscalPrinter() {
    return this.$store.getters['equipment/currentFiscalPrinter']
  },
  currentUser() {
    return this.$store.state.users.currentUser
  },
  cashRules() {      
    if (isNaN(Number(this.cash))) {
      return ['Некорректное значение',
            v => !!v || 'Введите значение']
    } else {
      return [v => Number(v) > 0 || 'Некорректное значение',
      v => !!v || 'Введите значение']         
    }      
  },
},
methods: {
  checkWasPrinted() {
    for (var key in this.print) {
      this.print[key] = false
    }
  },
  openShift() {
    this.print.openShift = true     
  }, 
  reportX() {
    this.print.reportX = true     
  },
  closeShift() {
    this.print.closeShift = true     
  },
  cashIn() {
    if (this.$refs.form.validate()) {
      this.print.cashIn = true  
    }   
  },
  cashOut() {
    if (this.$refs.form.validate()) {
      this.print.cashOut = true     
    }
  },
  
  stopLoading() {
    
  }
}
}
</script>

<style>
  
</style>



          