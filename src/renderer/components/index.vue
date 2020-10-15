<template>
<div>
  
</div>
</template>

<script>
 
  export default {
    name: 'index',
    
    data() {
      return {
        
      }
    },
    created() {
       this.$store.commit('users/reset')
      let app = this
      this.$store.dispatch('users/getUsers').then(()=> { 
        if (app.users.length) {
          app.$router.push('/login')
        } else {
        app.$store.dispatch('users/createUser', {
          name: "Администратор",
          password: "",
          role: "admin",
          vatin: null
        })
        app.$router.push('/login')
        }   
      })

           
    },
    computed: {
    users() {
      return this.$store.state.users.users
      }
    },
    methods: {

    
    }
  }
</script>

<style>
  
</style>
