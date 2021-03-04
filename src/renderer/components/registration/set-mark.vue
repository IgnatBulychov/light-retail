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
      @keydown.esc="closeDialogInputDataMatrix(); $store.commit('itemAdditionManager/init')"
      max-width="50%"
      v-model="dialogInputDataMatrix"  
      v-on:click:outside="closeDialogInputDataMatrix; $store.commit('itemAdditionManager/init')" 
    >
    <div @click.prevent="$refs.datamatrixInput.focus()">
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Код маркировки
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogInputDataMatrix(); $store.commit('itemAdditionManager/init')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
           <v-form @submit.prevent="setNomenclatureCode()">
        <v-card-text>
          <v-text-field
            ref="datamatrixInput"
            placeholder="Отсканируйте код маркировки"
            color="green"
            :append-icon="mdiDataMatrixScan"
            v-model="datamatrixCode"
            :rules="[]"
          ></v-text-field>        
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
      
          <v-btn type="submit" @click="setNomenclatureCode()" width="40%" height="50px" dark color="green lighten-2">
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

<alert :alert="alert"/>
  </div>
</template>

<script>
import Alert from '../alerts/alert'
import { mdiDataMatrixScan } from '@mdi/js'
import { createTag1162 } from './../functions/createTag1162'
export default {
    name: 'set-mark',
    components: {
      Alert
    },
    data() {
        return {
          
      mdiDataMatrixScan,
          datamatrixCode: "",
               dialogInputDataMatrix: false,
               alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      }
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
            if (this.item.datamatrix) {
              this.datamatrixCode = this.item.datamatrix
              this.setNomenclatureCode()
            } else {
              this.dialogInputDataMatrix = true
            }
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
        
        
        createTag1162(app.datamatrixCode).then(result => {   
             app.$store.commit('itemAdditionManager/setNomenclatureCode', [ result.gtin, result.serial, result.nomenclatureCode, result.raw ])     
          app.$store.dispatch('check/addItemtoCheck', app.item)
           console.log('res') 
          app.datamatrixCode = ""
          app.closeDialogInputDataMatrix()
        })
        .catch(err => {
          console.log('rej',err) 
          app.datamatrixCode = ""
          app.alert = err
        })
        
      },
      closeDialogInputDataMatrix() {
        let app = this
        setTimeout(function() {app.$store.commit('itemAdditionManager/barcodeInputFocus') }, 1) 
         this.datamatrixCode = ""
        this.dialogInputDataMatrix = false
      }
    }
}
</script>