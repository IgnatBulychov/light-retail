<template>
  <div @click="setFocus()">
    <v-card >
      <v-card-text>
        <v-container fluid>
        <v-row>
          <v-col cols="5" class="custom-block" >        
            <v-card
              tile
              
            >
              <v-card-text>
                <v-row>
                  <v-col cols="12" v-for="(paymentTypeDefault, key) in paymentTypesDefault" :key="key" >
                   <v-btn @click="selectedPaymentType = key; setFocus()" :color="selectedPaymentType == key ? 'primary' : 'secondary'"> 
                    <v-icon>{{ selectedPaymentType == key ? "mdi-chevron-right" : ""}}</v-icon>
                     {{ paymentTypes.find(type => type.value == paymentTypeDefault).text }}  {{ Object.values(getFromCustomer)[key] ? `(${Object.values(getFromCustomer)[key]} ₽)` : "" }}
                     </v-btn>      
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            </v-col>
            <v-col cols="7"  class="custom-block" >  
              <v-card v-if="selectedPaymentType == 0">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('cash')">
                <v-card-text>
                  <v-text-field
                    ref="getFromCustomerCashInput"
                    prefix="₽"
                    :placeholder="summ"
                    append-icon="mdi-rub"
                    color="green"
                    label="Принято от клиента наличными"
                    v-model="getFromCustomer.cash"
                    :rules="getFromCustomerCashRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>        
                  <div v-if="(getFromCustomer.cash-summ) > 0">
                    <h2 class="text-lg-h6"> Сдача: {{ (getFromCustomer.cash-summ).toFixed(2) }} </h2>
                  </div>
                  <div v-else>
                   <h2 class="text-lg-h6">  &nbsp </h2>
                  </div>
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>  
                      
                  <v-btn
                    color="success lighten-2"
                    large
                    elevation="1"
                    :disabled="getFromCustomer.cash == '' ? false: Number(getFromCustomer.cash) < summ ? true: false"
                    @click="printCheck('cash')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${getFromCustomer.cash == '' ? 'darken-2': Number(getFromCustomer.cash) < summ ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                        {{  (getFromCustomer.cash-summ) > 0 ? "Оплатить" : "Оплатить без сдачи"}}             
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

              <v-card v-if="selectedPaymentType == 1">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('electronically')">
                <v-card-text>
                  <v-text-field
                    :placeholder="summ"                    
                    color="green"
                    prefix="₽"
                    label="Сумма безналичными"
                    v-model="getFromCustomer.electronically"
                    ref="getFromCustomerElectronicallyInput"
                    :rules="getFromCustomerElectronicallyRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>   
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>    
                  
                  <v-btn
                   color="success lighten-2"
                    large
                    elevation="1"
                    :disabled="getFromCustomer.electronically == '' ? false: Number(getFromCustomer.electronically) != summ ? true: false"
                    @click="printCheck('electronically')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${getFromCustomer.electronically == '' ? 'darken-2': Number(getFromCustomer.electronically) != summ ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                       Оплатить по карте            
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

              <v-card v-if="selectedPaymentType == 2">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('prepaid')">
                <v-card-text>
                  <v-text-field
                    ref="getFromCustomerPrepaidInput"
                    prefix="₽"
                    :placeholder="summ"
                    append-icon="mdi-rub"
                    color="green"
                    label="Сумма предоплаты"
                    v-model="getFromCustomer.prepaid"
                    :rules="getFromCustomerPrepaidRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>  
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>        
                  <v-btn
                    color="success lighten-2"
                    large
                    elevation="1"
                    :disabled="getFromCustomer.prepaid == '' ? false: Number(getFromCustomer.prepaid) != summ ? true: false"
                    @click="printCheck('prepaid')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${getFromCustomer.prepaid == '' ? 'darken-2': Number(getFromCustomer.prepaid) != summ ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                       Оплатить            
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

              <v-card v-if="selectedPaymentType == 3" >
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('credit')">
                <v-card-text>
                  <v-text-field
                    ref="getFromCustomerCreditInput"
                    prefix="₽"
                    :placeholder="summ"
                    append-icon="mdi-rub"
                    color="green lighten-2"
                    label="Сумма кредита"
                    v-model="getFromCustomer.credit"
                    :rules="getFromCustomerCreditRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>  
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>        
                  <v-btn
                    color="success lighten-2"
                    large
                    elevation="1"
                    :disabled="getFromCustomer.credit == '' ? false: Number(getFromCustomer.credit) != summ ? true: false"
                    @click="printCheck('credit')"
                    type="submit"
                  >
                        <v-chip
                           :color="`grey ${getFromCustomer.credit == '' ? 'darken-2': Number(getFromCustomer.credit) != summ ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                       Оплатить            
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

              <v-card v-if="selectedPaymentType == 4">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('other')">
                <v-card-text>
                  <v-text-field
                    ref="getFromCustomerOtherInput"
                    prefix="₽"
                    :placeholder="summ"
                    append-icon="mdi-rub"
                    color="green"
                    label="Сумма встречного представления"
                    v-model="getFromCustomer.other"
                    :rules="getFromCustomerOtherRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>  
                </v-card-text>
                <v-card-actions>  
                  <v-spacer></v-spacer>        
                  <v-btn
                    color="success lighten-2"
                    large
                    elevation="1"
                    :disabled="getFromCustomer.other == '' ? false: Number(getFromCustomer.other) != summ ? true: false"
                    @click="printCheck('other')"
                    type="submit"
                  >
                        <v-chip
                           :color="`grey ${getFromCustomer.other == '' ? 'darken-2': Number(getFromCustomer.other) != summ ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                       Оплатить            
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

               <v-card v-if="selectedPaymentType == 5">
                <v-card-title>
                  <h2>
                  <span class="text-lg-h6">
                  К оплате   {{ summ }}   ₽   
                  </span> </h2>
                </v-card-title>
                
<v-card-text>
             <span v-if="Number(getFromCustomer.cash) + Number(getFromCustomer.electronically) + Number(getFromCustomer.prepaid) + Number(getFromCustomer.credit) + Number(getFromCustomer.other) < summ">
                    Для комбооплаты распределите  
                     {{ summ - getFromCustomer.cash - getFromCustomer.electronically - getFromCustomer.prepaid - getFromCustomer.credit - getFromCustomer.other }} ₽
                  </span>


                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <div tabindex="1"  ref="combo" v-on:keyup.13="printCheck('combo')" v-on:keyup.38="up()"  
                    v-on:keyup.40="down()" >
                  <v-btn
                  color="success lighten-2"
                    large
                    elevation="1"
                    @click="printCheck('combo')"
                    type="submit" >

                    <v-chip
                           color="grey darken-2"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp

                       Комбооплата          
                  </v-btn>
                  </div>
                   <v-spacer></v-spacer>
                </v-card-actions>
              
              </v-card>

            
            </v-col>
        
          </v-row>
          
          
           </v-container>    
       </v-card-text>
       
       <alert :alert="alert" />
    </v-card>
  </div>
</template>

<script>
import alert from '../alerts/alert.vue'
import paymentTypes from '../resources/paymentsTypes'
export default {
  components: { alert },
    name: 'payment',
    props: ['summ'],
    data() {
      return {
        paymentTypes,
        paymentType: [],
        getFromCustomer: {
          cash: "",
          electronically: "",
          prepaid: "",
          credit: "",
          other: "",
        },
        selectedPaymentType: 0,
        alert: {
            show: false,
            timeout: 2000,
            type: "success",
            text: ''
          }
      }
    },
    computed:{
      paymentTypesDefault() {
        return this.$store.state.settings.mainSettings.paymentTypesDefault
      },
      getFromCustomerCashRules() {      
        if (isNaN(Number(this.getFromCustomer.cash))) {
          return ['Некорректное значение']
        } else {
          if (this.getFromCustomer.cash == "") {
            return []  
          } else {
            return [v => Number(v) > 0 || 'Некорректное значение']
          }              
        }      
      },
      getFromCustomerElectronicallyRules() {      
        if (isNaN(Number(this.getFromCustomer.electronically))) {
          return ['Некорректное значение']
        } else {
          if (this.getFromCustomer.electronically == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.summ || 'Сумма безналичного платежа не может превышать сумму покупки'
            ]
          }              
        }      
      },
      getFromCustomerPrepaidRules() {      
        if (isNaN(Number(this.getFromCustomer.prepaid))) {
          return ['Некорректное значение']
        } else {
          if (this.getFromCustomer.prepaid == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.summ || 'Сумма предоплаты не может превышать сумму покупки'
            ]
          }              
        }         
      },
      getFromCustomerCreditRules() {      
        if (isNaN(Number(this.getFromCustomer.credit))) {
          return ['Некорректное значение']
        } else {
          if (this.getFromCustomer.credit == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.summ || 'Сумма кредита не может превышать сумму покупки'
            ]
          }              
        }            
      },
      getFromCustomerOtherRules() {      
        if (isNaN(Number(this.getFromCustomer.other))) {
          return ['Некорректное значение']
        } else {
          if (this.getFromCustomer.other == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.summ || 'Сумма встречного представления не может превышать сумму покупки'
            ]
          }              
        }      
      },
      getFromCustomerFocus() {        
        return this.$store.getters['payment/cashInputFocus']
      }
    },
    watch: {
      'getFromCustomerFocus': function() {
        this.setFocus()
      }
    },
    methods: {
      printCheck(type) {
        if (Number(this.getFromCustomer.electronically) + Number(this.getFromCustomer.prepaid) + Number(this.getFromCustomer.credit) + Number(this.getFromCustomer.other) > this.summ) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: 'Сумма всех оплат за исключением наличных не может привышать сумму чека'
          }
          return
        } else if ((this.selectedPaymentType == 5) && (Number(this.getFromCustomer.cash) + Number(this.getFromCustomer.electronically) + Number(this.getFromCustomer.prepaid) + Number(this.getFromCustomer.credit) + Number(this.getFromCustomer.other) < this.summ)) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: 'Недостаточная сумма оплат'
          }
          return
        }
        
        if ((type == 'cash') && (Number(this.getFromCustomer.cash) == 0)) {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.summ)
          })
        } else if ((type == 'cash') && (Number(this.getFromCustomer.cash) > this.summ)) {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.getFromCustomer.cash)
          })
        } else if (type == 'electronically') {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.summ)
          })
        } else if (type == 'prepaid') {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.summ)
          })
        } else if (type == 'credit') {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.summ)
          })
        } else if (type == 'other') {
          this.$emit('print-check', { 
            paymentType: this.paymentTypes[this.selectedPaymentType].value, 
            getFromCustomer: Number(this.summ)
          })
        } else if (type == 'combo') {
          this.$emit('print-check', { 
            paymentType: this.getFromCustomer, 
            getFromCustomer: Number(this.getFromCustomer.cash)
          })
        }
        
        this.getFromCustomer = {
          cash: "",
          electronically: "",
          prepaid: "",
          credit: "",
          other: "",
        }
        this.selectedPaymentType = 0
      },
      up() {
        if (this.selectedPaymentType == 0) {
          this.selectedPaymentType = this.paymentTypesDefault.length - 1
        } else {
          this.selectedPaymentType--
        }
        this.setFocus()
      },
      down() {
        if ((this.selectedPaymentType + 1) == this.paymentTypesDefault.length) {
          this.selectedPaymentType = 0
        } else {
          this.selectedPaymentType++
        }
        this.setFocus()
      },
      setFocus() {
        let app = this
        if (this.selectedPaymentType == 0) {
          setTimeout(()=> { app.$refs.getFromCustomerCashInput.focus() },1)
        } else if (this.selectedPaymentType == 1) {
          setTimeout(()=> { app.$refs.getFromCustomerElectronicallyInput.focus() },1)
        } else if (this.selectedPaymentType == 2) {
          setTimeout(()=> { app.$refs.getFromCustomerPrepaidInput.focus() },1)
        } else if (this.selectedPaymentType == 3) {
          setTimeout(()=> { app.$refs.getFromCustomerCreditInput.focus() },1)
        } else if (this.selectedPaymentType == 4) {
          setTimeout(()=> { app.$refs.getFromCustomerOtherInput.focus() },1)
        } else if (this.selectedPaymentType == 5) {
          setTimeout(()=> { app.$refs.combo.focus() },1)
        } 
      }
    }
}
</script>

<style scoped>
.custom-block {
  height: 100%;
}
</style>