<template>
  <div>
    <div class="py-1 px-2 code-input">
      <v-form @submit.prevent="(inputCode == '') ? $emit('toPayment') : scanFromInput() ">
        <v-text-field
          ref="barcodeInput"
          append-icon="mdi-barcode-scan"
          @click:append="scanFromInput()"
          color="green"
          placeholder="Отсканируйте или введите код" 
          solo
          v-model="inputCode"
          v-on:keyup.38="changePosition('up')"
          v-on:keyup.40="changePosition('down')"
          @keyup.46="removeItem(activeItem)"
          @keyup.106="inputCode = inputCode.replace(/\*/g, ''); if ((!items[activeItem].mark) && (!inputCode.length)) $emit('toItemChanging')"
        ></v-text-field>
        <v-btn class="d-none" type="submit">Submit</v-btn>
      </v-form>
    </div>
    <scanner-com-port 
      @scan-ean8="scanFromComPortEan8"
      @scan-ean13="scanFromComPortEan13"
      @scan-data-matrix="scanFromComPortDataMatrix" 
    />
    
    <alert :alert="alert"/>
  </div>
</template>

<script>

import Alert from '../alerts/alert'
import { getItemFromBaseByCode } from '../../store/dbAPI/items/getItemByCode'
import { getItemFromBaseByBarcode } from '../../store/dbAPI/items/getItemByBarcode'
import { getFolderByID } from '../../store/dbAPI/items/getFolderByID'

import { getAgencySchemeFromBase } from '../../store/dbAPI/agencySchemes/getAgencyScheme'
import { getSupplierFromBase } from '../../store/dbAPI/suppliers/getSupplier'

import ScannerComPort from '../equipment/scanner-com-port.vue'
export default {
    name: 'item-finder',
    components: {
      ScannerComPort, Alert
    },
    data() {
      return {
        inputCode: "",
        alert: {
          show: false,
          timeout: 2000,
          type: "success",
          text: ''
        }
      }
    },
    created() {
      this.$store.commit('itemAdditionManager/barcodeInputFocus')
    },
    computed:{
      activeItem() {
        return this.$store.state.check.activeItem
      }, 
      items() {
        return this.$store.state.check.items
      },
      taxationTypeDefault() {
        return this.$store.state.settings.mainSettings.taxationTypeDefault
      },
      barcodeInputFocus() {        
        return this.$store.getters['itemAdditionManager/barcodeInputFocus']
      }
    },
    watch: {
      'barcodeInputFocus': function() {
        let app = this
        app.$refs.barcodeInput.focus() 
      }
    },
    methods: {
      startItemBuilding(item) {
        let app = this
        async function buildItem(item) {

            let taxationType = null
            let agencyScheme = null

            if (item.parent != "root") {               
              let parent = await getFolderByID(item)
              if (parent.taxationType) {
                taxationType = parent.taxationType
              } else {
                taxationType = app.taxationTypeDefault
              }              
            } else {
              taxationType = app.taxationTypeDefault
            }

            if (item.agencyScheme) {
              let agencySchemeFromBase = await getAgencySchemeFromBase(item.agencyScheme)
              let supplierFromBase = await getSupplierFromBase(agencySchemeFromBase.supplier)
              console.log(agencySchemeFromBase)
              agencyScheme = agencySchemeFromBase
              agencyScheme.supplier = supplierFromBase
            }

            item.taxationType = taxationType
            item.agencyScheme = agencyScheme
            return item
        }  

        buildItem(item)
        .then(item => {   
          app.$store.commit('itemAdditionManager/setItem', item)
          app.$emit('item-selected') 
        })
      },
      changePosition (to) {
        this.$store.dispatch('check/changePosition', to)
      },
      removeItem(item) {
        this.$store.dispatch('check/removeItem', item)
      },
      scanFromInput () {
        let app = this
        if (this.inputCode !== "") {
          if (this.inputCode.length < 8){
            // если внутренний код
            getItemFromBaseByCode(this.inputCode).then(item => {
              if (item) {
                app.startItemBuilding(item)
              } else {
                app.alert = {
                  show: true,
                  timeout: 2000,
                  type: "error",
                  text: 'Ничего не найдено'
                }
                app.$store.commit('itemAdditionManager/init')
              }
            })
          } else if ((this.inputCode.length == 8) || (this.inputCode.length == 13)){
            // если ean8 или ean13
            getItemFromBaseByBarcode(this.inputCode).then(item => {
              if (item) {
                app.startItemBuilding(item)
              } else {
                app.alert = {
                  show: true,
                  timeout: 2000,
                  type: "error",
                  text: 'Ничего не найдено'
                }
                app.$store.commit('itemAdditionManager/init')
              }
            })
          } else if (this.inputCode.length > 13) {
            // если код маркировки
            let app = this        
            let datamatrix = this.inputCode
            let ean13 = Number(this.inputCode.slice(3, 16))
            getItemFromBaseByBarcode(ean13).then(item => {
              // присваиваем "сырой" код datamatrix для дальнейшего автодобавления к чеку
              if (item) {                
                item.datamatrix = datamatrix
                app.startItemBuilding(item)
              } else {
                app.alert = {
                  show: true,
                  timeout: 2000,
                  type: "error",
                  text: 'Ничего не найдено'
                }
                app.$store.commit('itemAdditionManager/init')
              }              
            })
          }
        }
        app.inputCode = ""
      },
      scanFromComPortEan8(code) {      
        let app = this
        getItemFromBaseByBarcode(code).then(item => {
          if (item) {
            app.startItemBuilding(item)
          } else {
            app.alert = {
              show: true,
              timeout: 2000,
              type: "error",
              text: 'Ничего не найдено'
            }
            app.$store.commit('itemAdditionManager/init')
          }
        })
      },
      scanFromComPortEan13(code) {      
        let app = this
        console.log('try2',code )
        getItemFromBaseByBarcode(code).then(item => {
          if (item) {
            app.startItemBuilding(item)
          } else {
            app.alert = {
              show: true,
              timeout: 2000,
              type: "error",
              text: 'Ничего не найдено'
            }
            app.$store.commit('itemAdditionManager/init')
          }
        })
      },
      scanFromComPortDataMatrix(code) {
        let app = this        
        let datamatrix = code
        
        console.log(Number(code.slice(3, 16)))
        let ean13 = Number(code.slice(3, 16))
        getItemFromBaseByBarcode(ean13).then(item => {
          if (item) {                
            item.datamatrix = datamatrix
            app.startItemBuilding(item)
          } else {
            app.alert = {
              show: true,
              timeout: 2000,
              type: "error",
              text: 'Ничего не найдено'
            }
            app.$store.commit('itemAdditionManager/init')
          } 
        })
      }
    }
}
</script>

<style scoped>
.code-input {
  height: 10vh;
}
</style>