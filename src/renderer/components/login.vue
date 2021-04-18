<template>
 <v-container>
   <v-row justify="center">
      <v-col cols="6" class="mt-5 pt-5 text-center">
         <v-form
          @submit.prevent="login()"
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-card>
           
              <v-card-title></v-card-title>
           
<v-card-text>
    
         <v-select
         color="success"
            v-model="user"
            :items="usersSelect"
            label="Пользователь"
          ></v-select>

          <v-text-field
           color="success"
            v-model="password"
            type="password"
            label="Пароль"
          ></v-text-field>
          
         

        
</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
 <v-btn
            color="success"
            class="mr-4"
            type="submit"
          >
            Начать работу
          </v-btn>
              <v-spacer></v-spacer>

             
            </v-card-actions>
          </v-card>
     </v-form>
      </v-col>
   </v-row>
   <alert :alert="alert" :timeout="2000"/>
 </v-container>
</template>

<script>
  import Alert from './alerts/alert'

var md5 = require('md5');
export default {
  name: 'login', 
  components: {
    Alert
  } ,  
  data() {
    return {
      valid: true,
      user: null,
      password: "",
      authSuccess: true,
      alert: {
        type: 'success',
        show: false,
        text: ''
      }
    }
  },
  created() {
    this.user = this.users[0]
  },
  computed: {
    users() {
      return this.$store.state.users.users
    },
    usersSelect() {
      let usersSelect = []
      this.users.forEach(user => {
        usersSelect.push({
          text: user.name,
          value: user
        })
      })
      return usersSelect
    },
  },
  methods: {
    login () {
      this.$refs.form.resetValidation()
      if (this.$refs.form.validate()) {
        console.log(this.user )
        if ((this.user.password == md5(this.password)) || (this.user.password == "")) {
          this.$store.commit('users/setCurrentUser', this.user)
          this.$router.push('/dashboard/landing')
        } else {
           this.alert = {
              show: true,
              type: 'error',
              text: 'Неверный пароль'
           }
        }
        
      }
    },
   /* reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },  */
  } 
}
</script>

<style>
  
</style>
