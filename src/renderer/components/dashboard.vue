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
        <v-list-item color="success" link to='/dashboard/registration'>
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
        <v-list-item v-if="currentUser.role == 'admin'" color="success" link to='/dashboard/settings'>
          <v-list-item-icon>
            <v-icon>mdi-cogs</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Настройки</v-list-item-title>
        </v-list-item>
        <v-list-item color="success" link to='/'>
          <v-list-item-icon>
            <v-icon>---</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Сменить пользователя</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content  height="100vh" >
      <v-container class="main-container" fluid>
        <router-view></router-view>
      </v-container>
    </v-content> 
  </v-app>
</template>

<script>
 
  export default {
    name: 'dashboard',
    
    data() {
      return {
        
      }
    },
    computed: {
      currentUser() {
        return this.$store.state.users.currentUser
      }
    },
    methods: {

    
    }
  }
</script>

<style scoped>
.main-container {
  padding: 0;
  height: 100vh;
}
</style>
