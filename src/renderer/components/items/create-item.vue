<template>
  <v-card>
        <v-card-title>
          Создание
          <v-spacer/>
          <v-switch
            v-model="fineTuning"
            label="Тонкая настройка"
          ></v-switch>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="item.title"
              label="Наименование"
          ></v-text-field>
          <v-text-field
              v-model="item.vendorCode"
              label="Артикул"
          ></v-text-field> 
          <v-text-field
              v-model="item.price"
              label="Цена"
          ></v-text-field>     
          <form @submit.prevent="addBarcode()">
            <v-text-field
                v-model="barcode"
                label="Штрихкод"
            ></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                    <v-icon class="warning--text">mdi-plus</v-icon>           
                  </v-btn>
              </template>
              <span>Добавить штрихкод</span>
            </v-tooltip> 
            <v-chip
              v-for="(barcode, key) in item.barcodes" :key="key"
              class="ma-2"
              color="secondary"
              text-color="white"
            >
              {{ barcode }}
              <v-btn  @click="item.barcodes.splice(key, 1)" icon>  
                <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
              </v-btn>
            </v-chip>                    
          </form>
          <v-switch
            v-model="item.mark"
            color="green"
            label="Маркированный товар"
          ></v-switch>

          <v-select
            :items="fineTuning ? itemTypes : itemTypesMinimal"
            label="Тип"
            v-model="item.itemType"
          ></v-select>

          <v-select
            v-if="fineTuning"
            :items="paymentMethods"
            label="Способ расчета"
            v-model="item.paymentMethod"
          ></v-select>

          <v-select
            :items="measureNames"
            label="Единица измерения"
            v-model="item.measureName"
          ></v-select>
          
          <v-select
            :items="taxes"
            label="Налоговая ставка"
            v-model="item.tax"
          ></v-select>
          <v-btn class="success" @click="createItem()">Создать товар</v-btn>
        </v-card-text>

  <scanner-com-port @scan-data-matrix="scanFromComPortDataMatrix" @scan-ean13="scanFromComPortEan13" />

      </v-card>
</template>

<script>
import ScannerComPort from './../equipment/scanner-com-port' 
import measureNames from '../resources/measureNames.js'
import taxes from '../resources/taxes.js'
import itemTypesMinimal from '../resources/itemTypesMinimal.js'
import itemTypes from '../resources/itemTypes.js'
import paymentMethods from './../resources/paymentMethods'
export default {
    name: 'create-item',  
    components: {
 ScannerComPort
    },
    data() {
      return {
        fineTuning: false,
         barcode: "",
         item:{
              title: '',
              price: null,
              costPrice: null,
              quantity: 0,
              vendorCode: "",
              paymentMethod: "fullPayment",
              barcodes:[],
              mark: false,
              measureName: 'шт',
              measureType: "integer",
              itemType: "commodity",
              tax: 'none',
              parent: "root"
          },
          measureNames,
          taxes,
          itemTypes,
          itemTypesMinimal,
          paymentMethods
      }
    },
    methods: { 
      createItem() {
        this.item.parent = this.$route.query.folder
        if (this.item.measureName == 'шт' || this.item.measureName == 'компл' || this.item.measureName == 'упак' || this.item.measureName == 'ед' || this.item.measureName == 'пар' || this.item.measureName == 'пач') {
          this.item.measureType = "integer"
        } else {
          this.item.measureType = "float"
        }       
        this.$store.dispatch('items/createItem', this.item)
        // сброс формы товара      
        
        this.item ={
              title: '',
              price: null,
              costPrice: null,
              quantity: 0,
              barcodes:[],
              mark: false,
              measureName: 'шт',
              measureType: "integer",
              tax: 'none',
              parent: "root"
          }
          this.$emit('itemWasCreated')
      },
      addBarcode() {
        this.item.barcodes.push(Number(this.barcode))
        this.barcode = ''
      },
      scanFromComPortDataMatrix(code) {
        console.log('доб', code )
        let ean13 = Number(code.slice(3, 16))
        if (this.dialogCreateItem) {
          this.item.barcodes.push(ean13)
        } 
        if (this.dialogUpdateItem) {
          this.itemForUpdate.barcodes.push(ean13)
        }
      },
      scanFromComPortEan13(code) {
        console.log('доб', code )
        if (this.dialogCreateItem) {
          this.item.barcodes.push(Number(code))
        } 
        if (this.dialogUpdateItem) {
          this.itemForUpdate.barcodes.push(Number(code))
        }
      },    
    }
}
</script>