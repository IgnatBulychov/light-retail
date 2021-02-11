<template>
  <div>
    <!-- диалог скан датаматрикс из ком порта 
    <v-dialog eager 
      @keydown.esc="closeDialogScanDatamatrixFromComPort()"
      max-width="50%"
      v-model="dialogScanDatamatrixFromComPort"  
      v-on:click:outside="closeDialogScanDatamatrixFromComPort()" 
    >
    <div>
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Код маркировки
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogScanDatamatrixFromComPort()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            placeholder="Отсканируйте код маркировки"
            color="green"
            :append-icon="mdiDataMatrixScan"
            :rules="[]"
          ></v-text-field>        
        </v-card-text>
        <v-card-actions>             
        </v-card-actions>
      </v-card>
      </div>
    </v-dialog>-->

    
    <v-dialog eager 
      @keydown.esc="closeDialogInputDataMatrix()"
      max-width="50%"
      v-model="dialogInputDataMatrix"  
      v-on:click:outside="closeDialogInputDataMatrix" 
    >
    <div @click.prevent="$refs.datamatrixInput.focus()">
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Код маркировки
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogInputDataMatrix()">
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
            v-on:keyup.enter="setNomenclatureCode()"
            :rules="[]"
          ></v-text-field>        
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn @click="setNomenclatureCode()" width="40%" height="50px" dark color="green lighten-2">
              <v-chip class="ma-2" color="gray" label dark text-color="white">
                <v-icon> mdi-keyboard </v-icon> Enter
              </v-chip> Ок        
            </v-btn>
             <v-spacer></v-spacer>          
        </v-card-actions>
      </v-card>
      </div>
    </v-dialog>


  </div>
</template>

<script>

import { mdiDataMatrixScan } from '@mdi/js'
import { createTag1162 } from './../functions/createTag1162'
export default {
    name: 'set-mark',
    data() {
        return {
          
      mdiDataMatrixScan,
          datamatrixCode: "",
               dialogInputDataMatrix: false
        }
    },
    computed: {
      item() {
        return this.$store.state.itemAdditionManager.item
      },
      liveStep() {        
        return this.$store.getters['itemAdditionManager/getLiveStep']
      }
    },
    created() {
     console.log("3", this.item)
    },
    watch: {
      "liveStep": function() {
        console.log("3", this.item)
        if (this.liveStep == 'quantitySetting') {
          console.log("3", this.item)
          if (this.item.mark) {
            //this.$store.commit('itemAdditionManager/setQuantity', 1)
            this.dialogInputDataMatrix = true
          } else {
            this.$store.dispatch('check/addItemtoCheck', this.item)
          }
        }
      },
      "dialogInputDataMatrix": function() {
        if (this.dialogInputDataMatrix) {
          let app = this
          setTimeout(function() {app.$refs.datamatrixInput.focus()}, 1) 
        }
      }
    },
    methods: {
         
      setNomenclatureCode() {
        let app = this
        console.log('!!!')
        
        createTag1162(app.datamatrixCode).then(result => {      
          app.$store.commit('itemAdditionManager/setNomenclatureCode', { gtin: result.gtin,serial: result.serial,nomenclatureCode:result.nomenclatureCode })     
          app.$store.dispatch('check/addItemtoCheck', this.item)
          app.datamatrixCode = ""
          app.closeDialogInputDataMatrix()
        })
        .catch(err => {
          


          app.datamatrixCode = ""
          app.alert = err
          app.closeDialogScanDatamatrix()
        })
        
      },
      closeDialogInputDataMatrix() {
        this.$store.commit('itemAdditionManager/barcodeInputFocus')
        this.$store.commit('itemAdditionManager/setLiveStep', "init")
         this.datamatrixCode = ""
        this.dialogInputDataMatrix = false
      }
    }
}
</script>