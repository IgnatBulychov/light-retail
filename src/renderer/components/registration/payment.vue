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
                     {{ paymentTypes.find(type => type.value == paymentTypeDefault).text }}  {{ Object.values(acceptedFromCustomer)[key] ? `(${Object.values(acceptedFromCustomer)[key]} ₽)` : "" }}
                     </v-btn>      
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            </v-col>
            <v-col cols="7"  class="custom-block" >  
              <v-span v-if="taxations.length > 1"> Внимание! Будет напечатано {{ taxations.length }} чека на {{ taxations.length }} разные СНО </v-span>
              <v-card v-if="selectedPaymentType == 0">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('cash')">
                <v-card-text>
                  <v-text-field
                    ref="acceptedFromCustomerCashInput"
                    prefix="₽"
                    :placeholder="sum"
                    append-icon="mdi-rub"
                    color="green"
                    label="Принято от клиента наличными"
                    v-model="acceptedFromCustomer.cash"
                    :rules="acceptedFromCustomerCashRules"
                    v-on:keyup.38="up()"
                    v-on:keyup.40="down()"
                  ></v-text-field>        
                  <div v-if="(acceptedFromCustomer.cash-sum) > 0">
                    <h2 class="text-lg-h6"> Сдача: {{ (acceptedFromCustomer.cash-sum).toFixed(2) }} </h2>
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
                    :disabled="acceptedFromCustomer.cash == '' ? false: Number(acceptedFromCustomer.cash) < sum ? true: false"
                    @click="printCheck('cash')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${acceptedFromCustomer.cash == '' ? 'darken-2': Number(acceptedFromCustomer.cash) < sum ? 'lighten-1': 'darken-2'}`"
                          label
                          text-color="white"
                        >
                          <v-icon left>
                            mdi-keyboard
                          </v-icon>
                          Enter
                        </v-chip> &nbsp
                        {{  (acceptedFromCustomer.cash-sum) > 0 ? "Оплатить" : "Оплатить без сдачи"}}             
                  </v-btn>
                  <v-spacer></v-spacer>     
                </v-card-actions>
                </v-form>
              </v-card>

              <v-card v-if="selectedPaymentType == 1">
                <v-card-title><h2>
                  <span class="text-lg-h6">
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('electronically')">
                <v-card-text>
                  <v-text-field
                    :placeholder="sum"                    
                    color="green"
                    prefix="₽"
                    label="Сумма безналичными"
                    v-model="acceptedFromCustomer.electronically"
                    ref="acceptedFromCustomerElectronicallyInput"
                    :rules="acceptedFromCustomerElectronicallyRules"
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
                    :disabled="acceptedFromCustomer.electronically == '' ? false: Number(acceptedFromCustomer.electronically) != sum ? true: false"
                    @click="printCheck('electronically')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${acceptedFromCustomer.electronically == '' ? 'darken-2': Number(acceptedFromCustomer.electronically) != sum ? 'lighten-1': 'darken-2'}`"
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
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('prepaid')">
                <v-card-text>
                  <v-text-field
                    ref="acceptedFromCustomerPrepaidInput"
                    prefix="₽"
                    :placeholder="sum"
                    append-icon="mdi-rub"
                    color="green"
                    label="Сумма предоплаты"
                    v-model="acceptedFromCustomer.prepaid"
                    :rules="acceptedFromCustomerPrepaidRules"
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
                    :disabled="acceptedFromCustomer.prepaid == '' ? false: Number(acceptedFromCustomer.prepaid) != sum ? true: false"
                    @click="printCheck('prepaid')"
                    type="submit"
                  >
                        <v-chip
                          :color="`grey ${acceptedFromCustomer.prepaid == '' ? 'darken-2': Number(acceptedFromCustomer.prepaid) != sum ? 'lighten-1': 'darken-2'}`"
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
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('credit')">
                <v-card-text>
                  <v-text-field
                    ref="acceptedFromCustomerCreditInput"
                    prefix="₽"
                    :placeholder="sum"
                    append-icon="mdi-rub"
                    color="green lighten-2"
                    label="Сумма кредита"
                    v-model="acceptedFromCustomer.credit"
                    :rules="acceptedFromCustomerCreditRules"
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
                    :disabled="acceptedFromCustomer.credit == '' ? false: Number(acceptedFromCustomer.credit) != sum ? true: false"
                    @click="printCheck('credit')"
                    type="submit"
                  >
                        <v-chip
                           :color="`grey ${acceptedFromCustomer.credit == '' ? 'darken-2': Number(acceptedFromCustomer.credit) != sum ? 'lighten-1': 'darken-2'}`"
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
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                <v-form @submit.prevent="printCheck('other')">
                <v-card-text>
                  <v-text-field
                    ref="acceptedFromCustomerOtherInput"
                    prefix="₽"
                    :placeholder="sum"
                    append-icon="mdi-rub"
                    color="green"
                    label="Сумма встречного представления"
                    v-model="acceptedFromCustomer.other"
                    :rules="acceptedFromCustomerOtherRules"
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
                    :disabled="acceptedFromCustomer.other == '' ? false: Number(acceptedFromCustomer.other) != sum ? true: false"
                    @click="printCheck('other')"
                    type="submit"
                  >
                        <v-chip
                           :color="`grey ${acceptedFromCustomer.other == '' ? 'darken-2': Number(acceptedFromCustomer.other) != sum ? 'lighten-1': 'darken-2'}`"
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
                  К оплате   {{ sum }}   ₽   
                  </span> </h2>
                </v-card-title>
                
<v-card-text>
             <span v-if="Number(acceptedFromCustomer.cash) + Number(acceptedFromCustomer.electronically) + Number(acceptedFromCustomer.prepaid) + Number(acceptedFromCustomer.credit) + Number(acceptedFromCustomer.other) < sum">
                    Для комбооплаты распределите  
                     {{ sum - acceptedFromCustomer.cash - acceptedFromCustomer.electronically - acceptedFromCustomer.prepaid - acceptedFromCustomer.credit - acceptedFromCustomer.other }} ₽
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
    props: ['sum'],
    data() {
      return {
        paymentTypes,
        acceptedFromCustomer: {
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
      items() {
        return this.$store.state.check.items
      },
      taxations() {
        let taxations = []
        this.items.forEach(element => {
          if (!taxations.includes(element.taxationType)) {
            taxations.push(element.taxationType)
          }          
        });
        return taxations
      },
      acceptedFromCustomerCashRules() {      
        if (isNaN(Number(this.acceptedFromCustomer.cash))) {
          return ['Некорректное значение']
        } else {
          if (this.acceptedFromCustomer.cash == "") {
            return []  
          } else {
            return [v => Number(v) > 0 || 'Некорректное значение']
          }              
        }      
      },
      acceptedFromCustomerElectronicallyRules() {      
        if (isNaN(Number(this.acceptedFromCustomer.electronically))) {
          return ['Некорректное значение']
        } else {
          if (this.acceptedFromCustomer.electronically == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.sum || 'Сумма безналичного платежа не может превышать сумму покупки'
            ]
          }              
        }      
      },
      acceptedFromCustomerPrepaidRules() {      
        if (isNaN(Number(this.acceptedFromCustomer.prepaid))) {
          return ['Некорректное значение']
        } else {
          if (this.acceptedFromCustomer.prepaid == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.sum || 'Сумма предоплаты не может превышать сумму покупки'
            ]
          }              
        }         
      },
      acceptedFromCustomerCreditRules() {      
        if (isNaN(Number(this.acceptedFromCustomer.credit))) {
          return ['Некорректное значение']
        } else {
          if (this.acceptedFromCustomer.credit == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.sum || 'Сумма кредита не может превышать сумму покупки'
            ]
          }              
        }            
      },
      acceptedFromCustomerOtherRules() {      
        if (isNaN(Number(this.acceptedFromCustomer.other))) {
          return ['Некорректное значение']
        } else {
          if (this.acceptedFromCustomer.other == "") {
            return []  
          } else {
            return [
              v => Number(v) > 0 || 'Некорректное значение',
              v => Number(v) <= this.sum || 'Сумма встречного представления не может превышать сумму покупки'
            ]
          }              
        }      
      },
      acceptedFromCustomerFocus() {        
        return this.$store.getters['payment/cashInputFocus']
      }
    },
    watch: {
      'acceptedFromCustomerFocus': function() {
        this.setFocus()
      }
    },
    methods: {
      printCheck(type) {
        if (Number(this.acceptedFromCustomer.electronically) + Number(this.acceptedFromCustomer.prepaid) + Number(this.acceptedFromCustomer.credit) + Number(this.acceptedFromCustomer.other) > this.sum) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: 'Сумма всех оплат за исключением наличных не может привышать сумму чека'
          }
          return
        } else if ((this.selectedPaymentType == 5) && (Number(this.acceptedFromCustomer.cash) + Number(this.acceptedFromCustomer.electronically) + Number(this.acceptedFromCustomer.prepaid) + Number(this.acceptedFromCustomer.credit) + Number(this.acceptedFromCustomer.other) < this.sum)) {
          this.alert = {
            show: true,
            timeout: 3000,
            type: "error",
            text: 'Недостаточная сумма оплат'
          }
          return
        }

        let payments = []
        
        if ((type == 'cash') && (Number(this.acceptedFromCustomer.cash) == 0)) {
          payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.sum)
          })
        } else if ((type == 'cash') && (Number(this.acceptedFromCustomer.cash) > this.sum)) {
           payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.acceptedFromCustomer.cash)
          })
        } else if (type == 'electronically') {
           payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.sum)
          })
        } else if (type == 'prepaid') {
           payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.sum)
          })
        } else if (type == 'credit') {
           payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.sum)
          })
        } else if (type == 'other') {
           payments.push({ 
            type: this.paymentTypes[this.selectedPaymentType].value, 
            sum: Number(this.sum)
          })
        } else if (type == 'combo') {

            for (var key in this.acceptedFromCustomer ) {
              console.log(this.acceptedFromCustomer[key])
              payments.push({
                  type: key,
                  sum: Number(Number(this.acceptedFromCustomer[key]).toFixed(2))
            })

        }
        }

        

/*
        if ((type == 'cash') && (Number(this.acceptedFromCustomer.cash) == 0)) {
          this.acceptedFromCustomer.cash = Number(this.sum)
        } 
         if ((type == 'cash') && (Number(this.acceptedFromCustomer.cash) > this.sum)) {
          this.acceptedFromCustomer.cash = Number(this.acceptedFromCustomer.cash)          
        } 
         if (type == 'electronically') {
          this.acceptedFromCustomer.electronically = Number(this.sum)
        } 
         if (type == 'prepaid') {
          this.acceptedFromCustomer.prepaid = Number(this.sum)
        } 
         if (type == 'credit') {
          this.acceptedFromCustomer.credit = Number(this.sum)
        } 
         if (type == 'other') {
          this.acceptedFromCustomer.other = Number(this.sum)
        } 
*/
        

       /*
          
        }*/
        
        console.log(payments)
        this.$store.commit('check/setPayments', payments)

        this.$emit('print-check')

        this.acceptedFromCustomer = {
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
          setTimeout(()=> { app.$refs.acceptedFromCustomerCashInput.focus() },1)
        } else if (this.selectedPaymentType == 1) {
          setTimeout(()=> { app.$refs.acceptedFromCustomerElectronicallyInput.focus() },1)
        } else if (this.selectedPaymentType == 2) {
          setTimeout(()=> { app.$refs.acceptedFromCustomerPrepaidInput.focus() },1)
        } else if (this.selectedPaymentType == 3) {
          setTimeout(()=> { app.$refs.acceptedFromCustomerCreditInput.focus() },1)
        } else if (this.selectedPaymentType == 4) {
          setTimeout(()=> { app.$refs.acceptedFromCustomerOtherInput.focus() },1)
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