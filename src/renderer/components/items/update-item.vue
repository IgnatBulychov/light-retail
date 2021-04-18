<template>
  <v-card>
        <v-card-title>
           Редактирование
          <v-spacer/>
          <v-switch
            v-model="fineTuning"
            label="Тонкая настройка"
          ></v-switch>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="itemForUpdate.title"
              label="Наименование"
          ></v-text-field>
            <v-text-field
              v-model="itemForUpdate.vendorCode"
              label="Артикул"
          ></v-text-field> 
          <v-text-field
              v-model="itemForUpdate.price"
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
              v-for="(barcode, key) in itemForUpdate.barcodes" :key="key"
              class="ma-2"
              color="secondary"
              text-color="white"
            >
              {{ barcode }}
              <v-btn  @click="itemForUpdate.barcodes.splice(key, 1)" icon>  
                <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
              </v-btn>
            </v-chip>                    
          </form>
          <v-switch
            v-model="itemForUpdate.mark"
            color="green"
            label="Маркированный товар"
          ></v-switch>

          <v-select
            :items="fineTuning ? itemTypes : itemTypesMinimal"
            label="Тип"
            v-model="itemForUpdate.itemType"
          ></v-select>

          <v-select
            v-if="fineTuning"
            :items="paymentMethods"
            label="Способ расчета"
            v-model="itemForUpdate.paymentMethod"
          ></v-select>

          <v-select
            :items="measureNames"
            label="Единица измерения"
            v-model="itemForUpdate.measureName"
          ></v-select>
          

          <v-select
            :items="taxes"
            label="Налоговая ставка"
            v-model="itemForUpdate.tax"
          ></v-select>

          
          <v-select
            v-if="fineTuning"
            :items="agencySchemes"
            label="Агентская схема"
            v-model="itemForUpdate.agencyScheme"
          ></v-select>


          <v-btn class="success" @click="updateItem()">Изменить товар</v-btn>
        </v-card-text>

        
          <scanner-com-port @scan-data-matrix="scanFromComPortDataMatrix" @scan-ean13="scanFromComPortEan13"  @scan-ean8="scanFromComPortEan8" />

      </v-card>
</template>

<script>
import ScannerComPort from './../equipment/scanner-com-port' 
import measureNames from '../resources/measureNames.js'
import taxes from '../resources/taxes.js'
import itemTypesMinimal from '../resources/itemTypesMinimal.js'
import itemTypes from '../resources/itemTypes.js'
import paymentMethods from './../resources/paymentMethods'
import agents from '../resources/agents.js'
export default {
    name: 'update-item', 
    props: ['itemForUpdate'],
    components: {
      ScannerComPort
    },
    data() {
      return {
         fineTuning: false,
        barcode: "",
        
           measureNames,
         taxes,
           itemTypes,
          itemTypesMinimal,
          paymentMethods,
          agents
      }
    },
    mounted() {
      this.$store.dispatch('agencySchemes/getAgencySchemes')
    },
    computed: {
      agencySchemes() {
        let app = this
        if (this.$store.state.agencySchemes.agencySchemes.length) {
          let agencySchemes = []
          this.$store.state.agencySchemes.agencySchemes.forEach(agencyScheme => {
            let name = "" 
            agencyScheme.agents.forEach(agent => {
              name = app.agents.find(item => item.value == agent).text +  ", " + name
            });
            agencySchemes.push({
              text:  name + " (" + agencyScheme.supplier.name + ")",
              value: agencyScheme._id
            })
          }); 
          return agencySchemes
        } else {
          return []
        }
      },
    },
    methods: { 
      
      updateItem() {        
        if (this.itemForUpdate.measureName == 'шт' || this.itemForUpdate.measureName == 'компл' || this.itemForUpdate.measureName == 'упак' || this.itemForUpdate.measureName == 'ед' || this.itemForUpdate.measureName == 'пар' || this.itemForUpdate.measureName == 'пач') {
          this.itemForUpdate.measureType = "integer"
        } else {
          this.itemForUpdate.measureType = "float"
        }
        this.$store.dispatch('items/updateItem', this.itemForUpdate)
        this.$emit('itemWasUpdated')
      }, 
      scanFromComPortDataMatrix(code) {
        console.log('доб', code )
        let ean13 = Number(code.slice(3, 16))
          this.itemForUpdate.barcodes.push(ean13)
        
      },
      scanFromComPortEan8(code) {
        console.log('доб', code )
          this.itemForUpdate.barcodes.push(Number(code))
        
      },  
      scanFromComPortEan13(code) {
        console.log('доб', code )
          this.itemForUpdate.barcodes.push(Number(code))
       
      },   
      addBarcode() {
        this.itemForUpdate.barcodes.push(Number(this.barcode))
        this.barcode = ''
      }, 
      
       
    }
}
</script>