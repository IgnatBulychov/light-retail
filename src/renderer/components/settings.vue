<template>
  <div>
    <v-tabs v-model="tab">      
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
        <v-container fluid>
          <v-card>
            <v-card-title>
              <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs" v-on="on"
                  color="success"
                  dark
                  icon
                  @click.stop="saveMainSettings()"
                >
                  <v-icon>mdi-content-save-outline</v-icon> 
                </v-btn>
              </template>
              <span>Сохранить настройки</span>
            </v-tooltip>
              
            </v-card-title>
            <v-card-text>
              <v-select
                :items="taxationTypes"
                label="СНО по умолчанию"
                v-model="taxationTypeDefault"
              ></v-select> 
            </v-card-text>
          </v-card>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
          <v-card>
            <v-card-title>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs" v-on="on"
                    color="success"
                    dark
                    icon
                    @click="dialogCreateUser = true"
                  >
                    <v-icon>mdi-plus</v-icon> 
                  </v-btn>
                </template>
                <span>Добавить пользователя</span>
              </v-tooltip>
              
            <!-- диалог создания пользователя -->
            <v-dialog eager 
              @keydown.esc="dialogCreateUser = false"
              max-width="50%"
              v-model="dialogCreateUser"  
              v-on:click:outside="dialogCreateUser = false" 
            >
            <v-card>
              <v-card-title>
                <span class="text-lg-h6">
                  Создание нового пользователя
                </span>
                <v-spacer></v-spacer>
                  <v-btn icon @click="dialogCreateUser = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-form @submit.prevent="createUser()" ref="formCreateUser" v-model="valid" lazy-validation>
                  <v-card-text>
                    <v-text-field
                      placeholder="ФИО"
                      v-model="user.name"
                      :rules="nameRules"
                    ></v-text-field> 
                    <v-text-field
                      placeholder="ИНН"
                      v-model="user.vatin"
                      :rules="vatinRulesCreateUser"
                    ></v-text-field>      
                    <v-select
                      :items="roles"
                      label="Роль"
                      v-model="user.role"
                    ></v-select>  
                    <v-text-field
                      placeholder="Пароль"
                      type="password"
                      v-model="user.password"
                    ></v-text-field>  
                  
                  </v-card-text>
                  <v-card-actions>                    
                    <v-btn type="submit" width="40%" height="50px" dark color="green lighten-2">
                      Создать       
                    </v-btn>
                    <v-spacer></v-spacer>          
                  </v-card-actions>
                </v-form>   
              </v-card>
            </v-dialog>
              <!-- конец диалога -->
          </v-card-title>

          <v-card-text>
            <div v-if="users.length">
              <v-row>
                <v-col cols="1">
                  #
                </v-col>
                <v-col cols="3">
                  Имя
                </v-col>
                <v-col cols="3">
                  Роль
                </v-col>
                <v-col cols="3">
                  Пароль
                </v-col>
                <v-col cols="2">
                  Действия
                </v-col>
              </v-row>
              <v-row v-for="(user, key) in users" :key="user.id">
                <v-col cols="1">
                  {{ key + 1 }}
                </v-col>
                <v-col cols="3">
                  {{ user.name }}
                </v-col>
                <v-col cols="3">
                  {{ user.role == 'admin' ? "Адмиистратор" : "Кассир" }}
                </v-col>
                <v-col cols="3">
                  {{ user.password ? user.password : 'Не задан' }}
                </v-col>
                <v-col cols="2"> 
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon @click="userForUpdate = Object.assign({}, user); dialogUpdateUser = true">  
                          <v-icon class="warning--text">mdi-pen</v-icon>           
                        </v-btn>
                    </template>
                    <span>Изменить пользователя</span>
                  </v-tooltip>                      
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" icon @click="removeUser(user._id)">  
                          <v-icon class="error--text">mdi-delete-outline</v-icon>           
                        </v-btn>
                    </template>
                    <span>Удалить пользователя</span>
                  </v-tooltip> 
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-container>          
    </v-tab-item>

    <!-- разед настройки касс -->
    <v-tab-item>
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
                    @click.stop="dialogSelectModel = true"
                  >
                    <v-icon>mdi-plus</v-icon> 
                  </v-btn>
                </template>
                <span>Добавить кассу</span>
              </v-tooltip> 

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
                  v-on:save-fiscal-printer="createFiscalPrinter"
                ></atol-settings>
              </v-dialog>
            </div>  

            <v-row>
              <v-col cols="1">#
              </v-col>
              <v-col cols="2">Текущая касса
              </v-col>
              <v-col cols="3">Модель
              </v-col>
              <v-col cols="3">Заводской номер
              </v-col>
              <v-col cols="3">Действия
              </v-col>
            </v-row>

            <div v-if="fiscalPrinters.length">
              <v-row v-for="(fiscalPrinter, key) in fiscalPrinters" :key="fiscalPrinter._id">            
                <v-col cols="1">
                  <div class="py-5"> {{ key + 1 }} </div>
                </v-col>
                <v-col cols="2"> 
                  <v-switch 
                    v-model="listActivity[key]"
                    @change="updateFiscalPrinter(fiscalPrinter, key)"
                  ></v-switch>
                </v-col>
                <v-col cols="3">                   
                  <div class="py-5"> {{ fiscalPrinter.model }} </div>
                </v-col>
                <v-col cols="3"> 
                  <div class="py-5"> {{ fiscalPrinter.serial }} </div>
                </v-col>
                <v-col cols="3">
                  <div class="py-5">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" icon  @click="removeFiscalPrinter(fiscalPrinter._id)">  
                            <v-icon class="error--text">mdi-delete-outline</v-icon>           
                          </v-btn>
                      </template>
                      <span>Удалить кассу</span>
                    </v-tooltip> 
                  </div>
                </v-col>            
              </v-row>
            </div>
            <div v-else class="text-center"> Нет подключенных касс </div> 
          </v-card-text>
        </v-card>
      </v-container>
    </v-tab-item>
  </v-tabs-items>
    
  <!-- диалог изменения пользователя -->
    <v-dialog eager 
      @keydown.esc="dialogUpdateUser = false"
      max-width="50%"
      v-model="dialogUpdateUser"  
      v-on:click:outside="dialogUpdateUser = false" 
    >
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
          Изменение пользователя
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="dialogUpdateUser = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-form @submit.prevent="updateUser()" ref="formUpdateUser" v-model="valid" lazy-validation>
          <v-card-text>
            <v-text-field
              placeholder="ФИО"
              :rules="nameRules"
              v-model="userForUpdate.name"
            ></v-text-field>  
            <v-text-field
              placeholder="ИНН"
              v-model="userForUpdate.vatin"
              :rules="vatinRulesUpdateUser"
            ></v-text-field>     
            <v-select
              :items="roles"
              label="Роль"
              v-model="userForUpdate.role"
            ></v-select>  
            <v-text-field
              placeholder="Пароль"
              type="password"
              v-model="userForUpdate.password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>                    
            <v-btn type="submit" width="40%" height="50px" dark color="green lighten-2">
              Изменить       
            </v-btn>
            <v-spacer></v-spacer>          
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- конец диалога -->

    <alert :alert="alert" :timeout="5000" />

  </div>
</template>

<script>
import AtolSettings from './kkt-settings/atol-settings'
import Alert from './alerts/alert.vue'
import taxationTypes from './resources/taxationTypes.js'

export default {
  name: 'settings',
  components: {
    AtolSettings, Alert
  },
  data() {
    return {
      tab: null,
      valid: true,
      dialogSelectModel: false,
      dialogSettings: false,
      dialogCreateUser: false,
      dialogUpdateUser: false,
      roles: [
        {
          text: "Администратор",
          value: "admin"
        },
          {
          text: "Кассир",
          value: "cashier"
        }
      ],
      user: {
        name: "",
        role: "admin",
        password: "",
        vatin: ""
      },
      userForUpdate: {
        name: "",
        role: "admin",
        password: "",
        vatin: ""
      },  
      nameRules:[
        v => !!v || 'ФИО - обязательное поле'      
      ],     
      taxationTypes: taxationTypes,
      alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      }
    }
  },
  computed: {
    users() {
      return this.$store.state.users.users
    },
    currentUser() {
      return this.$store.state.users.currentUser
    },
    fiscalPrinters()  {
      return this.$store.state.fiscalPrinters.fiscalPrinters
    },
    listActivity() {
      let list = []
      this.fiscalPrinters.forEach(element => {
          list.push(element.active)
      });
      return list
    },
    taxationTypeDefault: {
      get: function() {
        return this.$store.state.settings.taxationTypeDefault
      },
      set: function(v) {
        this.$store.commit('settings/setTaxationTypeDefault', v)
      }
    },  
    vatinRulesUpdateUser() {
      if (this.userForUpdate.vatin) {
        return [
          v => (v.length == 0 || v.length == 12) || 'Некорректный ИНН',
          v =>  /^\d+$/.test(v) || 'Некорректный ИНН'       
        ]
      } else {
        return []
      }
    },
    vatinRulesCreateUser() {
      if (this.user.vatin) {
        return [
          v => (v.length == 0 || v.length == 12) || 'Некорректный ИНН',
          v =>  /^\d+$/.test(v) || 'Некорректный ИНН'       
        ]
      } else {
        return []
      }
    } 
  },  
  mounted() {
    this.$store.dispatch('settings/getSettings')
    this.$store.dispatch('users/getUsers')
    this.$store.dispatch('fiscalPrinters/getFiscalPrinters')    
  },
  methods: {
    removeUser(id) {
      this.$store.dispatch('users/removeUser', id)
    },
    createUser() {
      if (this.$refs.formCreateUser.validate()) {
        this.$store.dispatch('users/createUser',this.user)
        this.dialogCreateUser = false
        this.user = {
          name: "",
          role: "admin",
          password: "",
          vatin: ""
        }
        this.$refs.formCreateUser.resetValidation()
      }      
    },
    updateUser() {
      if (this.$refs.formUpdateUser.validate()) {
        this.$store.dispatch('users/updateUser', this.userForUpdate)
        if (this.userForUpdate._id == this.currentUser._id) {
          this.$store.commit('users/setCurrentUser', this.userForUpdate)
        }
        this.dialogUpdateUser = false
        this.userForUpdate = {
          name: "",
          role: "admin",
          password: "",
          vatin: ""
        }
        this.$refs.formUpdateUser.resetValidation()
      }      
    },
    saveMainSettings() {
      let app = this
      this.$store.dispatch('settings/updateMainSettings', {
        taxationTypeDefault: app.taxationTypeDefault
      })
      this.alert = {
        show: true,
        type: "success",
        timeout: 2000,
        text: 'Настройки сохранены'
      }
    },
    createFiscalPrinter(fiscalPrinter) {
      let app = this
      this.$store.dispatch('fiscalPrinters/createFiscalPrinter', fiscalPrinter)
      app.dialogSettings = false
      this.alert = {
        show: true,
        type: "success",
        timeout: 2000,
        text: 'Настройки сохранены'
      }
    },
    updateFiscalPrinter(fiscalPrinter) {
      this.$store.dispatch('fiscalPrinters/updateFiscalPrinter', fiscalPrinter)
    },
    removeFiscalPrinter(id) {
      this.$store.dispatch('fiscalPrinters/removeFiscalPrinter', id)
    },
  }
}
</script>

<style>
  
</style>



