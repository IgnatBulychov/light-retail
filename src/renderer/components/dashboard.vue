<template>
  <v-app>
    <v-navigation-drawer
     
      app
      permanent
      expand-on-hover
      
        
        
    >
      <v-list
        nav
        dense
      >
        <v-list-item color="success" link to='/dashboard/landing'>
          <v-list-item-icon>
            <v-icon>mdi-apps</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Меню</v-list-item-title>
        </v-list-item>
        <v-list-item color="success" link to='/dashboard/registration?folder=root'>
          <v-list-item-icon>
            <v-icon>mdi-printer-pos</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Чеки</v-list-item-title>
        </v-list-item>
        <v-list-item color="success" link to='/dashboard/reports'>
          <v-list-item-icon>
            <v-icon>mdi-clipboard-text-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Отчеты</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser.role == 'admin'" color="success" link to='/dashboard/items?folder=root'>
          <v-list-item-icon>
            <v-icon>mdi-package-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Товары</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser.role == 'admin'" color="success" link to='/dashboard/customers'>
          <v-list-item-icon>
            <v-icon>mdi-account-multiple-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Клиенты</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser.role == 'admin'" color="success" link to='/dashboard/suppliers'>
          <v-list-item-icon>
            <v-icon>mdi-account-box-multiple-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Поставщики</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="currentUser.role == 'admin'" color="success" link to='/dashboard/settings'>
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Настройки</v-list-item-title>
        </v-list-item>
        <v-list-item color="success" link to='/'>
          <v-list-item-icon>
            <v-icon>mdi-account-convert</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Сменить пользователя</v-list-item-title>
        </v-list-item>
        <v-list-item color="success" link @click="dialogExitConfirm = true">
          <v-list-item-icon>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Выход</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-dialog eager 
        @keydown.esc="dialogExitConfirm = false"
        max-width="50%"
        v-model="dialogExitConfirm"  
        v-on:click:outside="dialogExitConfirm = false" 
      >
        <v-card>
          <v-card-title>
          </v-card-title>
          <v-card-text class="text-center">            
            <span class="text-lg-h6">Вы уверены?</span>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success"  @click="exit(); dialogExitConfirm = false">
              Да
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="dialogExitConfirm = false">
              Нет
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>

    <v-main  height="100vh" >
      <v-container class="main-container" fluid>
        <router-view></router-view>
      </v-container>
    </v-main> 
  </v-app>
</template>

<script>
const remote = require('electron').remote
const application = remote.app
  export default {
    name: 'dashboard',
    
    data() {
      return {
        dialogExitConfirm:false
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.users.currentUser
      }
    },
    methods: {
      exit() {
        application.quit()
      }
    
    }
  }
</script>

<style scoped>
.main-container {
  padding: 0;
  height: 100vh;
}
</style>
