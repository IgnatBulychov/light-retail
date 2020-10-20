<template>
  <div @click="$refs.barcodeInput.focus()"  color="grey lighten-2" class="registration-block">
    <div class="py-1 px-2 code-input">
      <v-form @submit.prevent="(inputCode == '') ? toPayment() : addItem() ">
        <v-text-field
          ref="barcodeInput"
          append-icon="mdi-barcode-scan"
          @click:append="addItem()"
          color="green"
          label="Regular"
          placeholder="Отсканируйте или введите код" 
          solo
          v-model="inputCode"
          v-on:keyup.38="changePosition('up')"
          v-on:keyup.40="changePosition('down')"
          @keyup.46="removeItem(activeItem)"
          @keyup.106="inputCode = inputCode.replace(/\*/g, ''); if (!items[activeItem].mark) toItemChanging()"
        ></v-text-field>
        <v-btn class="d-none" type="submit">Submit</v-btn>
      </v-form>
    </div>

    <div class="check-items"  height="80%">
      <v-container v-if="items.length">
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
            <div v-if="!item.mark">    
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
      <v-toolbar dark color="green lighten-5">    
        <v-toolbar-items>
          <!--          
          <v-btn @click="dialogAddFree = true"  icon color="success">
            <v-icon>mdi-plus</v-icon> 
          </v-btn>
          <v-btn @click="dialogAddFromBase = true"  icon color="success">
              <v-icon>mdi-view-grid-plus</v-icon>
          </v-btn> 
          -->
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
            v-model="dialogAddFree"
            max-width="80%"
          >
           <!-- <add-free></add-free> -->
          </v-dialog>

          <v-dialog eager
            v-model="dialogAddFromBase"
            max-width="80%"
          >
            <!-- <add-from-base></add-from-base> -->
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
     <div  @click.prevent="$refs.getFromCustomerInput.focus()">
      <v-card>
        <v-card-title><h2>
          <span class="text-lg-h6">
          К оплате   {{ summ }}   ₽   
          </span> </h2>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogPayment()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="getFromCustomerInput"
            prefix="₽"
            :placeholder="summ"
            append-icon="mdi-rub"
            color="green"
            label="Принято от клиента"
            v-model="getFromCustomer"
            v-on:keyup.121="toConfirmCashless()"
            v-on:keyup.enter="printCheck('cash')"
            :rules="getFromCustomerRules"
          ></v-text-field>        
          <div v-if="(getFromCustomer-summ) > 0">
            <h2 class="text-lg-h6"> Сдача: {{ (getFromCustomer-summ).toFixed(2) }} </h2>
          </div>
        </v-card-text>
        <v-card-actions>          
          <v-btn
            width="45%"
            height="50px"
            dark
            :disabled="!items.length"
            color="green lighten-2"
            @click="printCheck('cash')"
          >
                <v-chip
                  class="ma-2"
                  color="gray"
                  label
                  text-color="white"
                >
                  <v-icon left>
                    mdi-keyboard
                  </v-icon>
                  Enter
                </v-chip> 
                {{  (getFromCustomer-summ) > 0 ? "Наличными" : "Наличными без сдачи"}}             
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="toConfirmCashless()"
            width="45%"
            height="50px"
            color="green lighten-2"
            dark
          >
            <v-chip
              class="ma-2"
              color="gray"
              label
              text-color="white"
            >
              <v-icon left>
                mdi-keyboard
              </v-icon>
              F10
            </v-chip>
            <v-icon>mdi-credit-card-outline</v-icon> Банковской картой
          </v-btn>
        </v-card-actions>
      </v-card>
       <!-- диалог подтверждения безналичного расчета -->


    <v-dialog eager 
      @keydown.esc="closeDialogConfirmСashless()"
      max-width="60%"
      v-model="dialogConfirmСashless"  
      v-on:click:outside="getFromCustomerFocus"     
    >
      <div tabindex="0" ref="dialogConfirmCashlessDiv" v-on:keyup.enter="printCheck('electronically')">
        <v-card>
          <v-card-title>
            <h2> <span class="text-lg-h6"> К оплате {{ summ }} ₽</span> </h2>     
          </v-card-title>
          <v-card-text class="text-center">
            <h3> Оплата по банковскому терминалу прошла успешно? </h3>
          </v-card-text>
          <v-card-actions>          
            <v-btn @click="printCheck('electronically')" :disabled="!items.length" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Да         
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialogConfirmСashless()" width="40%" height="50px">
              <v-chip class="ma-2" color="gray" label dark text-color="white" >
                <v-icon> mdi-keyboard </v-icon> Esc
              </v-chip> Отмена       
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </div>
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
        <v-card-text>          
          <v-text-field
            ref="itemQuantity"
            :placeholder="quantityOfSelectedItem.toString()"
            color="green"
            label="Количество"
            v-model="quantity"
            v-on:keyup.enter="changeItem()"
            :rules="quantityRules"
          ></v-text-field>        
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn @click="changeItem()" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Ок        
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
      </v-card>
      </div>
    </v-dialog>

    <!-- диалог изменения позиции -->

    <v-dialog eager 
      @keydown.esc="closeDialogScanDatamatrix()"
      max-width="50%"
      v-model="dialogScanDatamatrix"  
      v-on:click:outside="closeDialogScanDatamatrix" 
    >
    <div @click.prevent="$refs.datamatrixInput.focus()">
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Код маркировки
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogScanDatamatrix()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            ref="datamatrixInput"
            placeholder="Отсканируйте код маркировки"
            color="green"
            :append-icon="mdiDataMatrixScan"
            v-model="datamatrixCode"
            v-on:keyup.enter="addKTN()"
            :rules="[]"
          ></v-text-field>        
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn @click="addKTN()" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Ок        
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
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
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Настройки чека
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="dialogCheckSettings = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            :items="checkTypes"
            label="Тип чека"
            v-model="checkType"
          ></v-select>     
<div v-if="items.length">
          <v-select
            :items="taxationTypes"
            label="СНО чека"
            v-model="taxationType"
            disabled
          ></v-select>     
</div>
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn @click="saveCheckSettings()" width="40%" height="50px" dark color="green lighten-2">
                Сохранить       
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <alert :alert="alert"/>
  </div>
</template>

<script>
import { mdiDataMatrixScan } from '@mdi/js'
import { mdiDataMatrix } from '@mdi/js'
import { convertKTN } from './../functions/convertKTN'
import taxationTypes from './../resources/taxationTypes'
import checkTypes from './../resources/checkTypes'
import addFree from './addFree'
import addFromBase from './addFromBase'
import Alert from '../alerts/alert'
export default {
  name: 'registration',
  components: {
    addFromBase, addFree, Alert
  },
  data() {
    return {
      mdiDataMatrixScan,
      mdiDataMatrix,
      inputCode: "",
      dialogAddFree: false,
      dialogAddFromBase: false,
      dialogPayment: false,
      dialogItemChanging: false,
      dialogConfirmСashless: false,
      dialogScanDatamatrix: false,
      dialogCheckSettings: false,
      datamatrixCode: "",
      nomenclatureCode: "",
      currentMarkItem: null,
      getFromCustomer: "",
      checkType: 'sell',
      checkTypes,
      taxationTypes,
      quantity: "",
      quantityOfSelectedItem: "",
      alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      }
    }
  },
  mounted () {
    this.$refs.barcodeInput.focus()   
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
    activeItem() {
      return this.$store.state.check.activeItem
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
    taxationType() {
      return this.$store.state.check.checkSettings.taxationType
    },
    currentUser() {
      return this.$store.state.users.currentUser
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
    getFromCustomerRules() {      
      if (isNaN(Number(this.getFromCustomer))) {
        return [v => v > 0 || 'Некорректное значение']
      } else {
        if (this.getFromCustomer == "") {
           return []  
        } else {
         return [v => v > 0 || 'Некорректное значение']
        }              
      }      
    }
  },
  methods: {
    addItem () {
      let app = this
      if (app.inputCode !== "") {
        if (app.inputCode.length == 13) {
          // если ean13
          app.$store.dispatch('check/getItemByBarcode', app.inputCode).then(item => {
            // если поиск вернет маркированный товар           
            app.toScanDatamatrix()
            app.currentMarkItem = item
          })
        } else if (app.inputCode.length < 7) {
          // если внутренний код
          app.$store.dispatch('check/getItemByCode', app.inputCode).then(item => {
            // если поиск вернет маркированный товар           
            app.toScanDatamatrix()
            app.currentMarkItem = item
          })
        } else if (app.inputCode.length > 14) {
          // если код маркировки
          if (app.inputCode.length == 29) {
            // если DataMatrix (пункт 7 инструкции ЧЗ)
            app.$store.dispatch('check/getItemByBarcodeWithoutScan', app.inputCode)


          } else {            
            // если DataMatrix GS1 (пункт 6 инструкции ЧЗ)
            convertKTN(app.inputCode).then(result => {
              app.$store.dispatch('check/getItemByBarcodeWithoutScan', app.inputCode)
              .then(result => {
                   
                   
              })
              .catch(err => {
               
                
              })
            })
            .catch(err => {
              app.alert = err
            })
          }
        }    
      }
      app.inputCode = ""
    },
    addKTN() {
      let app = this
      console.log('!!!')
      convertKTN(app.datamatrixCode).then(result => {        
        app.currentMarkItem.quantity = 1    
        app.currentMarkItem.gtin = result.gtin
        app.currentMarkItem.serial = result.serial
        app.currentMarkItem.nomenclatureCode = result.nomenclatureCode
        app.$store.commit('check/addItemToCheck', app.currentMarkItem)      
        app.currentMarkItem = null
        app.datamatrixCode = ""
        app.closeDialogScanDatamatrix()
      })
      .catch(err => {
        app.currentMarkItem = null
        app.datamatrixCode = ""
        app.alert = err
        app.closeDialogScanDatamatrix()
      })
      
    },
    removeItem(item) {
      this.$store.dispatch('check/removeItem', item)
    },
    clearCheck() {
      this.$store.commit('check/clearCheck')
    },
    changePosition (to) {
      this.$store.dispatch('check/changePosition', to)
    },
    changeQuantity(item, changing) {
      this.$store.dispatch('check/changeQuantity', [ item, changing ])      
    },
    printCheck(way) {
      let app = this

      let check = {}

      check.type = app.checkType
      check.taxationType = app.taxationType
      check.operator = {
        name: "",
        vatin: ""
      }
      check.operator.name = app.currentUser.name
      check.operator.vatin = app.currentUser.vatin

      check.items = app.items

      check.payments = []

      if (way == "electronically") {

        check.payments[0] =  {
           "type": "electronically",
           "sum": app.summ
        }
          console.log(check)

      } else if (way == "cash"){
        if (isNaN(Number(this.getFromCustomer))) {
          console.log('no')
        } else {
          if ((this.getFromCustomer == "") || (Number(this.getFromCustomer) >= Number(this.summ))){
            console.log('yes')
            check.payments[0] =  {
              "type": "cash",
              "sum": app.getFromCustomer
            }
            console.log(check)
          }             
        }  
      }
      
    },
    barcodeInputFocus() {
      let app = this
      //не грамотно работает, нужно поймать уничтоение компонента
      setTimeout(function() { app.$refs.barcodeInput.focus() }, 1)
    },
    getFromCustomerFocus() {
      let app = this
      //не грамотно работает, нужно поймать уничтоение компонента
      setTimeout(function() { app.$refs.getFromCustomerInput.focus() }, 1)
    },
    toPayment() {
      if (!this.items.length) {        
        return
      }
      this.dialogPayment = true;
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.getFromCustomerInput.focus() }, 1)
    },
    toScanDatamatrix() {
      this.dialogScanDatamatrix = true;
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.datamatrixInput.focus() }, 1)
    },
    toConfirmCashless() {
      this.dialogConfirmСashless = true;
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.dialogConfirmCashlessDiv.focus() }, 1)
    },
    toItemChanging() {
      let app = this 
      if (this.inputCode == "") {
          this.quantityOfSelectedItem = this.items[this.activeItem].quantity
        //не грамотно работает, нужно поймать уничтоение компонента
        this.dialogItemChanging = true;
        setTimeout(function() { app.$refs.itemQuantity.focus() }, 1)
      }
    },
    changeItem() {
      if (this.quantity == "") {
        this.closeDialogItemChanging()   
      } else if (this.quantity > 0) {
        this.$store.dispatch('check/setQuantity', [ this.activeItem, this.quantity])
        this.closeDialogItemChanging()   
      }   
    },
    saveCheckSettings() {

    },
    closeDialogPayment() {
      this.dialogPayment = false
      this.getFromCustomer = ""
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.barcodeInput.focus() }, 1)
    },
    closeDialogScanDatamatrix() {
      this.dialogScanDatamatrix = false
      this.datamatrixInput = ""
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.barcodeInput.focus() }, 1)
    },
    closeDialogConfirmСashless() {
      this.dialogConfirmСashless = false
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.getFromCustomerInput.focus() }, 1)
    },
    closeDialogItemChanging() {
      this.dialogItemChanging = false
      
      //не грамотно работает, нужно поймать уничтоение компонента
      let app = this
      setTimeout(function() { app.$refs.barcodeInput.focus() }, 1)
      this.quantity = ""
    }
  }
}
</script>

<style scoped>
.registration-block {
  height: 100vh;
}
.code-input {
  height: 10%;
}
.check-items {
  height: 80%;
  overflow: auto
}
.footer-bar {
  height: 10%;
} 
</style>




          