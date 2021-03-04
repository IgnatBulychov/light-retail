<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <div class="mx-auto  px-2 py-2" >          
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs" v-on="on"
                color="success"
                dark
                icon
                @click.stop="dialogSelectFiscalPrinterModel = true"
              >
                <v-icon>mdi-plus</v-icon> 
              </v-btn>
            </template>
            <span>Добавить кассу</span>
          </v-tooltip> 

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs" v-on="on"
                color="success"
                dark
                icon
                @click.stop="dialogScannerSettings = true"
              >
                <v-icon>mdi-plus</v-icon> 
              </v-btn>
            </template>
            <span>Добавить сканер</span>
          </v-tooltip> 

          <v-dialog
            v-model="dialogSelectFiscalPrinterModel"
            max-width="50%"
          >
            <v-card>
              <v-card-title class="headline">Выберите модель кассы</v-card-title>
              <v-card-actions>
                <v-btn
                  color="primary"
                  tile outlined 
                  text
                  @click="dialogSelectFiscalPrinterModel = false; dialogAtolSettings = true"
                >
                  Атол
                </v-btn>
                 <v-btn
                  color="primary"
                  tile outlined 
                  text
                
                  @click="dialogSelectFiscalPrinterModel = false; dialogMercSettings = true"
                >
                  Меркурий
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogAtolSettings" max-width="80%" >
            <atol-settings
              v-on:save-fiscal-printer="createFiscalPrinter"
            ></atol-settings>
          </v-dialog>

          <v-dialog v-model="dialogMercSettings" max-width="80%" >
            <merc-settings
              v-on:save-fiscal-printer="createFiscalPrinter"
            ></merc-settings>
          </v-dialog>


          <v-dialog v-model="dialogScannerSettings" max-width="80%" >
            <scanner-settings
              v-on:save-scanner="createScanner"
            ></scanner-settings>
          </v-dialog>
        </div>  

        <v-row>
          <v-col cols="1">#
          </v-col>
          <v-col cols="2">Вкл/Выкл
          </v-col>
          <v-col cols="2">Тип
          </v-col>
          <v-col cols="3">Модель
          </v-col>
          <v-col cols="3">Заводской номер
          </v-col>
          <v-col cols="1">Действия
          </v-col>
        </v-row>

        <div v-if="equipment.length">
          <v-row v-for="(equipmentItem, key) in equipment" :key="equipmentItem._id">            
            <v-col cols="1">
              <div class="py-5"> {{ key + 1 }} </div>
            </v-col>
            <v-col cols="2"> 
              <v-switch 
                v-model="equipmentItem.active"
                @change="updateEquipmentItem(equipmentItem)"
              ></v-switch>
            </v-col>
            <v-col cols="2">                   
              <div class="py-5"> {{ equipmentItem.type }} </div>
            </v-col>
            <v-col cols="3">                   
              <div class="py-5"> {{ equipmentItem.model }} </div>
            </v-col>
            <v-col cols="3"> 
              <div class="py-5"> {{ equipmentItem.serial }} </div>
            </v-col>
            <v-col cols="1">
              <div class="py-5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon  @click="removeEquipmentItem(equipmentItem._id)">  
                        <v-icon class="error--text">mdi-delete-outline</v-icon>           
                      </v-btn>
                  </template>
                  <span>Удалить</span>
                </v-tooltip> 
              </div>
            </v-col>            
          </v-row>
        </div>
        <div v-else class="text-center"> Нет оборудования </div> 
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import ScannerSettings from './scanners/scanner-settings.vue'
import AtolSettings from './fiscalPrinters/atol-settings.vue'
import MercSettings from './fiscalPrinters/merc-settings.vue'
import Alert from '../../alerts/alert'

export default {
  name: 'equipment',
  components: {
    Alert, ScannerSettings, AtolSettings, MercSettings
  },
  data() {
      return {
        ports: [],
        port: "COM1",
        valid: true,
        dialogSelectFiscalPrinterModel: false,
        dialogAtolSettings: false,
        dialogMercSettings: false,
        dialogScannerSettings: false,
        alert: {
          type: 'success',
          show: false,
          text: '',
          timeout: 3000
        }
      }
  },
  computed: {
    equipment() {
      return this.$store.state.equipment.equipment
    },
    listActivity() {
      let list = []
      this.equipment.forEach(element => {
          list.push(element.active)
      });
      return list
    },
   },
  methods: {
    createFiscalPrinter(fiscalPrinter) {
      let app = this
      this.$store.dispatch('equipment/createEquipmentItem', fiscalPrinter)
      app.dialogAtolSettings = false
      app.dialogMercSettings = false
      app.alert = {
        show: true,
        type: "success",
        timeout: 2000,
        text: 'Настройки сохранены'
      }
    },
    removeEquipmentItem(id){
      this.$store.dispatch('equipment/removeEquipmentItem', id)
    },
    updateEquipmentItem(equipment) {
      this.$store.dispatch('equipment/updateEquipmentItem', equipment)
    },
    createScanner(scanner) {
      let app = this
      this.$store.dispatch('equipment/createEquipmentItem', scanner)
      app.dialogScannerSettings = false
      this.alert = {
        show: true,
        type: "success",
        timeout: 2000,
        text: 'Настройки сохранены'
      }
    },
  }
}
</script>