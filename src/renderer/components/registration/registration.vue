<template>
  <div @click="$store.commit('itemAdditionManager/barcodeInputFocus')"  color="grey lighten-2" class="registration-block">

   
<item-finder @toPayment="toPayment" @toItemChanging="toItemChanging()"/>

<new-item-float-or-int />

<set-mark />


    <div class="check-items" >
      <v-container  class="check-items" fluid v-if="items.length">
        <v-row class="text-center">
          <v-col cols="3" class="text-left">
            Наименование
          </v-col>
          <v-col cols="1">
            Цена
          </v-col>
          <v-col cols="3">
            Количество
          </v-col>
          <v-col cols="3">
            Действия
          </v-col>
          <v-col cols="2">
            Сумма
          </v-col>
        </v-row>
        <v-row 
          class="text-center"
          v-for="(item, key) in items" :key="key" 
          v-bind:class="[activeItem == key ? 'primary--text' : '', 'row text-center']"
        >
          <v-col cols="3" class="text-left">
              <span v-bind:class="activeItem == key ? 'font-weight-bold' : ''"> {{ item.title }} </span>            
          </v-col>
          <v-col cols="1">
            <span v-bind:class="activeItem == key ? 'font-weight-bold' : ''">  {{ Number(item.price).toFixed(2) }} ₽  </span>             
          </v-col>
          <v-col cols="3"> 
            <div v-if="item.mark">  
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" v-bind:class="activeItem == key ? 'font-weight-bold' : ''"> 
                    <v-icon>{{mdiDataMatrix}}</v-icon>
                  </span>
                </template>
                <span>GTIN: {{ item.gtin }}</span> <br>
                <span>S/N: {{ item.serial }}</span> <br>
                <span>КТН: {{ item.nomenclatureCode }}</span>
              </v-tooltip>             
            </div>
            <div v-else-if="item.measureType == 'integer'" class="text-center">
              <v-btn
                icon
                @click="changeQuantity(key, 0)"
              >
                <v-icon :class="activeItem == key ? 'green--text' : 'gray--text'" >mdi-minus</v-icon>
              </v-btn>    
                <span v-bind:class="activeItem == key ? 'font-weight-bold' : ''">  {{ item.quantity }} </span>   
              <v-btn
                icon
                @click="changeQuantity(key, 1)"
              >
                <v-icon :class="activeItem == key ? 'green--text' : 'gray--text'" >mdi-plus</v-icon>
              </v-btn>
            </div>
            <div v-else class="text-center">                 
                <span v-bind:class="activeItem == key ? 'font-weight-bold' : ''">  {{ Number(item.quantity).toFixed(3) }} {{ item.measureName }}</span>   
            </div>
          </v-col>

          <v-col cols="3">   
            <v-chip  :class="activeItem == key ? 'gray' : ''" small :dark="activeItem == key"  text-color="white" label>
                {{ item.mark ? "Del" : "✱/ Del" }}
            </v-chip>
            <v-btn v-if="!item.mark"  icon @click="activeItem = key; toItemChanging()">
              <v-icon class="warning--text" >mdi-pen</v-icon>         
            </v-btn>

            <v-btn icon  @click="removeItem(key)">     
              <v-icon class="error--text">mdi-delete-outline</v-icon>           
            </v-btn>
          </v-col>
          <v-col cols="2">         
           <span v-bind:class="activeItem == key ? 'font-weight-bold' : ''"> {{ Number(item.quantity*item.price).toFixed(2) }} ₽ </span>   
          </v-col>
        </v-row>
      </v-container>

      <div v-else class="text-center">
        <v-icon>mdi-scaner</v-icon> Добавьте позиции в чек 
      </div>
    </div>


    <div class="footer-bar" >
      <v-toolbar dark color="green lighten-5" class="tool-bar-custom">    
        <v-toolbar-items >

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn  v-bind="attrs" v-on="on" @click="dialogAddItemFromBase = true" icon color="success">
                  <v-icon>mdi-view-grid-plus</v-icon>
                </v-btn>
            </template>
            <span>Добавить из базы</span>
          </v-tooltip>
          
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn  v-bind="attrs" v-on="on" @click="dialogCheckSettings = true" icon color="primary">
                  <v-icon>mdi-settings</v-icon>
                </v-btn>
            </template>
            <span>Настройки чека</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn  v-bind="attrs" v-on="on" @click="clearCheck()" icon color="error">
                  <v-icon>mdi-sticker-remove-outline</v-icon>
                </v-btn>
            </template>
            <span>Очистить чек</span>
          </v-tooltip>

          <v-dialog eager
            v-model="dialogAddItemFromBase"
            width="90%"
          >
            <add-item-from-base @item-selected="itemSelected"></add-item-from-base>
          </v-dialog>

        </v-toolbar-items>
          
        <v-spacer></v-spacer>

        <v-toolbar-items class="px-0">
          <v-btn width="350px" @click="toPayment()"  color="green lighten-2">
            <v-chip
              class="ma-2"
              color="gray"
              label
              text-color="white"
            >
              <v-icon>
                mdi-keyboard
              </v-icon>
                Enter
            </v-chip>
            <h3> К оплате:  {{ summ }} ₽ </h3>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>

    <!-- payment cards -->

    <v-dialog eager 
      @keydown.esc="closeDialogPayment()"
      max-width="85%"
      v-model="dialogPayment"  
      v-on:click:outside="barcodeInputFocus"
    >
      <payment @print-check="printCheck" :summ="summ" />
    </v-dialog>


    <!-- диалог изменения позиции -->

    <v-dialog eager 
      @keydown.esc="closeDialogItemChanging()"
      max-width="50%"
      v-model="dialogItemChanging"  
      v-on:click:outside="barcodeInputFocus"
    >
    <div @click.prevent="$refs.itemQuantity.focus()">
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Редактировать позицию
        </span> 
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogItemChanging()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
         <v-form @submit.prevent="changeItem()">
        <v-card-text>          
          <v-text-field
            ref="itemQuantity"
            :placeholder="quantityOfSelectedItem.toString()"
            color="green"
            label="Количество"
            v-model="quantity"
            :rules="quantityRules"
          ></v-text-field>   
      
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn type="submit" @click="changeItem()" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Ок        
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
        </v-form>
      </v-card>
      </div>
    </v-dialog>

  




    <!-- диалог настроек чека -->

    <v-dialog eager 
      @keydown.esc="dialogCheckSettings = false"
      max-width="50%"
      v-model="dialogCheckSettings"  
      v-on:click:outside="dialogCheckSettings = false" 
    >
      <check-settings 
        @settings-was-saved="dialogCheckSettings = false"
      />
    </v-dialog>


    <fiscal-printer 
      @check-printed="checkWasPrinted" 
      :print="print" 
      :summ="summ" 
      :paymentType="paymentType" 
      :getFromCustomer="getFromCustomer" 
    />

    <alert :alert="alert"/>
  </div>
</template>

<script>
import { mdiDataMatrix } from '@mdi/js'
import FiscalPrinter from './../equipment/fiscal-printer'
import AddItemFromBase from './add-item-from-base'

import ItemFinder from './item-finder'
import NewItemFloatOrInt from './new-item-float-or-int'
import SetMark from './set-mark'

import Alert from '../alerts/alert'
import CheckSettings from './check-settings.vue'
import Payment from './payment.vue'
export default {
  name: 'registration',
  components: {
    AddItemFromBase, Alert, FiscalPrinter, CheckSettings, 
    ItemFinder, NewItemFloatOrInt, SetMark,
    Payment
  },
  data() {
    return {
      mdiDataMatrix,    
      dialogAddItemFromBase: false,
      dialogPayment: false,
      dialogItemChanging: false,
      dialogScanDatamatrix: false,
      dialogScanDatamatrixFromComPort: false,
      dialogCheckSettings: false,
      datamatrixCode: "",
      nomenclatureCode: "",
      currentMarkItem: null,  
      paymentType: '',
      getFromCustomer: '',    
      quantity: "",
      quantityOfSelectedItem: "",
      print: false,
      alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      },      
    }
  },
  mounted () {
    this.$store.dispatch('check/getCheckSettings')
    this.$store.commit('settings/getSettings')
    this.$store.commit('itemAdditionManager/init')
    this.barcodeInputFocus()
  },
  watch: {
    '$store.state.check.alert': function () {
      //клонирование во избежания вызова мутаций после выключения алерт
      let clone = {}
      Object.assign(clone, this.$store.state.check.alert)
      this.alert = clone 
    }
  },
  computed: {   
    activeItem: {
      get() {
        return this.$store.state.check.activeItem
      },
      set(v) {
        this.$store.commit('check/setActiveItem', v)
      }
    },  
    summ() {
      let summ = 0;
      if (this.items.length) {
        this.items.forEach(item => {
          summ = summ + (item.price * item.quantity)
        });
      }        
      return summ.toFixed(2)
    },
    items() {
        return this.$store.state.check.items
    },
    quantityRules() {      
      if (isNaN(Number(this.quantity))) {
        return [v => v > 0 || 'Некорректное значение']
      } else {
        if (this.quantity == "") {
           return []  
        } else {
         return [v => v > 0 || 'Некорректное значение']
        }              
      }      
    },
    
   /* currentScanner() {
      return this.$store.getters['equipment/currentScanner']
    }*/
  },
  methods: {
    removeItem(item) {
      this.$store.dispatch('check/removeItem', item)
    },
    clearCheck() {
      this.$store.commit('check/clearCheck')
    },
    changeQuantity(item, changing) {
      this.$store.dispatch('check/changeQuantity', [ item, changing ])      
    },
    printCheck(data) {
      console.log("Registration: print check")
      this.paymentType = data.paymentType
      this.getFromCustomer = data.getFromCustomer
      this.print = true     
      this.dialogPayment = false
      this.barcodeInputFocus() 
    },
    checkWasPrinted(result) {
      console.log('!', result)
      this.alert = result
      if (result.type == "success") {
        this.print = false
        
        this.barcodeInputFocus()
        this.clearCheck()
      } else {
        this.print = false
        this.barcodeInputFocus()
      }
    },
    barcodeInputFocus() {
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
    },
    getFromCustomerFocus() {
      let app = this
      setTimeout(function() { app.$refs.getFromCustomerInput.focus() }, 1)
    },
    toPayment() {
      if (!this.items.length) {        
        return
      }
      this.dialogPayment = true;
      let app = this
      setTimeout(function() { app.$store.commit('payment/cashInputFocus')  }, 1)
    },
    toScanDatamatrix() {
      this.dialogScanDatamatrix = true;
      let app = this
      setTimeout(function() { app.$refs.datamatrixInput.focus() }, 1)
    },
    toItemChanging() {
      let app = this 
      this.quantityOfSelectedItem = this.items[this.activeItem].quantity
      this.dialogItemChanging = true;
      setTimeout(function() { app.$refs.itemQuantity.focus() }, 1)
    },
    changeItem() {
       if (this.quantity > 0) {
        this.$store.dispatch('check/setQuantity', [ this.activeItem, this.quantity ])    
      }   
      this.closeDialogItemChanging()   
    },
    itemSelected() {
      this.dialogAddItemFromBase = false
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
    },
    closeDialogPayment() {
      this.dialogPayment = false
      this.getFromCustomer = ""
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
    },
    closeDialogScanDatamatrix() {
      this.dialogScanDatamatrix = false
      this.datamatrixInput = ""
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
    },
    closeDialogScanDatamatrixFromComPort() {
      this.dialogScanDatamatrixFromComPort = false
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
    },
    closeDialogItemChanging() {
      this.dialogItemChanging = false
      let app = this
      setTimeout(function() { app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1)
      this.quantity = ""
    }
  }
}
</script>

<style scoped>
.registration-block {
  height: 100vh;
  padding: 0;
}

.check-items {
  height: 80%;
  overflow: auto
}
.footer-bar {
  height: 10%;
} 
.tool-bar-custom {
height: 100%;
}
</style>




          