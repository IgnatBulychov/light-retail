<template>
  <div>
    <v-tabs
      v-model="tab"
    >
      <v-tab>
        Общие
      </v-tab>

      <v-tab>
        Пользователи
      </v-tab>
      
      <v-tab>
        Кассы
      </v-tab>
     
    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item>
        
          <v-select
            :items="taxSystems"
            label="СНО по умолчанию"
            v-model="taxSystemDefault"
          ></v-select>  
      <v-btn class="success" @click="saveSettings()">Сохранить</v-btn>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
           <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs" v-on="on"
                color="success"
                dark
                icon
                @click="dilaogCreateUser = true"
              >
                <v-icon>mdi-plus</v-icon> 
              </v-btn>
            </template>
            <span>Добавить пользователя</span>
          </v-tooltip>
          
          <div v-if="users.length">
            <v-row>
              <v-col cols="1">
                #
              </v-col>
              <v-col cols="4">
                Имя
              </v-col>
              <v-col cols="4">
                Роль
              </v-col>
              <v-col cols="3">
                Пароль
              </v-col>
            </v-row>
            <v-row v-for="(user, key) in users" :key="user.id">
              <v-col cols="1">
                {{ key + 1 }}
              </v-col>
              <v-col cols="4">
                {{ user.name }}
              </v-col>
              <v-col cols="4">
                {{ user.role == 'admin' ? "Адмиистратор" : "Кассир" }}
              </v-col>
              <v-col cols="3">
                {{ user.password ? user.password : 'Не задан' }}
              </v-col>
            </v-row>
          </div>
        </v-container>
          
      </v-tab-item>


       <v-tab-item>
        <div class="mx-auto  px-2 py-2" >
          
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs" v-on="on"
                color="primary"
                dark
                @click.stop="dialogSelectModel = true"
              >
                <v-icon left>mdi-plus</v-icon> 
              </v-btn>
            </template>
            <span>Добавить кассу</span>
          </v-tooltip>

         

          <v-btn
            color="primary"
            dark
            @click.stop="save()"
             tile outlined 
          >
            <v-icon left>mdi-save</v-icon> Сохранить
          </v-btn>

          <v-dialog
            v-model="dialogSelectModel"
            max-width="50%"
          >
            <v-card>
              <v-card-title class="headline">Выберите модель кассы</v-card-title>
              <v-card-actions>
              
                <v-btn
                  color="primary"
                   tile outlined 
                  text
                  @click="dialogSelectModel = false; dialogSettings = true"
                >
                  Атол
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogSettings" max-width="80%" >
            <atol-settings
              v-on:selected="dialogSettings = false"
            ></atol-settings>
          </v-dialog>
        </div>  

<v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Текущая касса</th>
                  <th class="text-left">Модель</th>
                  <th class="text-left">Заводской номер</th>
                   <th class="text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="fiscalRegisters.length">


     
                  <tr v-for="fiscalRegister in fiscalRegisters" :key="fiscalRegister.id">
                      <td> 
                        <v-radio-group v-model="selectedFR">
                          <v-radio :value="fiscalRegister._id"></v-radio> 
                        </v-radio-group>
                      </td>
                      <td>{{ fiscalRegister.model }}</td>
                      <td>{{ fiscalRegister.serial }}</td>
                      <td> <v-btn @click="deleteFiscalRegister(fiscalRegister._id)">Удалить</v-btn></td>
                     
                  </tr>
                 
                </template>
                <template v-else>
                  <tr>
                    <td colspan="4" class="text-center">Нет подключенных касс</td>
                    
                  </tr>
                </template>         
              </tbody>
            </template>
          </v-simple-table>

      </v-tab-item>
    
    </v-tabs-items>

     <alert :alert="alert" :timeout="5000" />
  </div>
</template>

<script>
  import AtolSettings from './kkt-settings/atolsettings'
 import Alert from './alerts/alert.vue'


  export default {
    name: 'settings',
    components: {
      AtolSettings, Alert
    },
    data() {
      return {
        tab: null,
        dialogSelectModel: false,
        dialogSettings: false,
        dilaogCreateUser: false,
        selectedFR: null,
        taxSystems: [
            {
              text: 'Общая',
              value: 'osn'
            },
            {
              text: 'УСН Доход',
              value: 'usnIncome'
            },
            {
              text: 'УСН Доход минус Расход',
              value: 'usnIncomeOutcome'
            },
            {
              text: 'ЕНВД',
              value: 'envd'
            },
            {
              text: 'Единый сельскохозяйственный налог',
              value: 'esn'
            },
            {
              text: 'Патент',
              value: 'patent'
            }            
          ],
        alert: {
          show: false,
          type: "success",
          text: ''
        }
      }
    },
    computed: {
      fiscalRegisters() {
        return this.$store.state.fiscalRegisters.fiscalRegisters
      },
      users() {
        return this.$store.state.users.users
      }
    },
  
    mounted() {
      this.$store.dispatch('fiscalRegisters/getFiscalRegisters');
      this.$store.dispatch('users/getUsers')
      this.selectedFR = this.$store.state.fiscalRegisters.currentFR
    },
    methods: {
      deleteFiscalRegister(id) {
        this.$store.dispatch('fiscalRegisters/deleteFiscalRegister', id)
      },
      save() {
        let app = this
        this.$store.dispatch('fiscalRegisters/saveCurrentFR', app.selectedFR)
        this.alert = {
          show: true,
          type: "success",
          text: 'Настройки сохранены'
        }
      },
      saveSettings() {
        let app = this
        this.$store.dispatch('fiscalRegisters/saveCurrentFR', app.selectedFR)
        this.alert = {
          show: true,
          type: "success",
          text: 'Настройки сохранены'
        }
      }
    }
  }
</script>

<style>
  
</style>



