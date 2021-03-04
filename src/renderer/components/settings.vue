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
        Оборудование
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <main-settings/>
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
                <v-col cols="4">
                  Имя
                </v-col>
                <v-col cols="3">
                  Роль
                </v-col>
                <v-col cols="4">
                  Действия
                </v-col>
              </v-row>
              <v-row v-for="(user, key) in users" :key="user.id">
                <v-col cols="1">
                  {{ key + 1 }}
                </v-col>
                <v-col cols="4">
                  {{ user.name }}
                </v-col>
                <v-col cols="3">
                  {{ user.role == 'admin' ? "Адмиистратор" : "Кассир" }}
                </v-col>
                <v-col cols="4"> 
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


    <v-tab-item>
      <equipment />
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
import Alert from './alerts/alert.vue'
import MainSettings from './settings/main-settings.vue'
import Equipment from './settings/equipment/equipment.vue'

var md5 = require('md5');
export default {
  name: 'settings',
  components: {
    Alert, MainSettings, Equipment
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
      alert: {
        show: false,
        timeout: 2000,
        type: "success",
        text: ''
      },
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
    
    this.$store.dispatch('users/getUsers')
   // this.$store.dispatch('fiscalPrinters/getFiscalPrinters')    
    
    
  },
  methods: {
    removeUser(id) {
      this.$store.dispatch('users/removeUser', id)
    },
    createUser() {
      if (this.$refs.formCreateUser.validate()) {
        this.user.password = md5(this.user.password)
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
        
        if (this.userForUpdate._id == this.currentUser._id) {
          this.$store.dispatch('users/updateUser', this.userForUpdate)
          this.userForUpdate.password = md5(this.userForUpdate.password)
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
   /* updateFiscalPrinter(fiscalPrinter) {
      this.$store.dispatch('fiscalPrinters/updateFiscalPrinter', fiscalPrinter)
    },
    removeFiscalPrinter(id) {
      this.$store.dispatch('fiscalPrinters/removeFiscalPrinter', id)
    },*/
  }
}
</script>

<style>
  
</style>



