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
          @keyup.106="inputCode = inputCode.replace(/\*/g, ''); if (!items[activeItem].mark) toItemChanging()"
        ></v-text-field>
        <v-btn class="d-none" type="submit">Submit</v-btn>
      </v-form>
    </div>
      <scanner-com-port 
        @scan-ean8="scanFromComPortEan8"
        @scan-ean13="scanFromComPortEan13"
        @scan-data-matrix="scanFromComPortDataMatrix" 
      />
    </div>
</template>

<script>
import { getItemFromBaseByCode } from '../../store/dbAPI/items/getItemByCode'
import { getItemFromBaseByBarcode } from '../../store/dbAPI/items/getItemByBarcode'
export default {
    name: 'item-finder',
    data() {
        return {
               inputCode: "",
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
               app.$store.commit('itemAdditionManager/setItem', item)
            })
          } else if ((this.inputCode.length == 8) || (this.inputCode.length == 13)){
            // если ean8 или ean13
            getItemFromBaseByBarcode(this.inputCode).then(item => {
               app.$store.commit('itemAdditionManager/setItem', item)
            })
          } else if (this.inputCode.length > 13) {
            // если код маркировки
            let app = this        
            let datamatrix = this.inputCode
            let ean13 = Number(this.inputCode.slice(3, 16))
            getItemFromBaseByBarcode(ean13).then(item => {
              // присваиваем "сырой" код datamatrix для дальнейшего автодобавления к чеку
              console.log(item)
              item.datamatrix = datamatrix
              app.$store.commit('itemAdditionManager/setItem', item)
            })
          }
        }
        app.inputCode = ""
      },
      scanFromComPortEan8(code) {      
        let app = this
        getItemFromBaseByBarcode(code).then(item => {
            app.$store.commit('itemAdditionManager/setItem', item)
        })
      },
      scanFromComPortEan13(code) {      
        let app = this
        getItemFromBaseByBarcode(code).then(item => {
            app.$store.commit('itemAdditionManager/setItem', item)
        })
      },
      scanFromComPortDataMatrix(code) {
        let app = this        
        let datamatrix = code
        let ean13 = Number(this.inputCode.slice(3, 16))
        getItemFromBaseByBarcode(ean13).then(item => {
          item.datamatrix = datamatrix
          app.$store.commit('itemAdditionManager/setItem', item)
        })
      }
    }
}
</script>