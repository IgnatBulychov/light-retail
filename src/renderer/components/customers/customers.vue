<template>
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
              @click.stop="dialogCreateCustomer = true"
            >
              <v-icon>mdi-plus</v-icon> 
            </v-btn>
          </template>
          <span>Добавить поставщика</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-dialog 
          eager 
          @keydown.esc="dialogCreateCustomer = false"
          max-width="50%"
          v-model="dialogCreateCustomer"  
          v-on:click:outside="dialogCreateCustomer = false" 
        >
          <create-customer @close-dialog="dialogCreateCustomer = false"/>
        </v-dialog>

        <div v-if="customers.length">
          <v-row v-for="(customer, key) in customers" :key="customer._id">            
            <v-col cols="1">
              <div class="py-5"> {{ key + 1 }} </div>
            </v-col>
            <v-col cols="4">                   
              <div class="py-5"> {{ customer.name }} </div>
            </v-col>
            <v-col cols="2"> 
              <div class="py-5"> {{ customer.phone }} </div>
            </v-col>            
            <v-col cols="2"> 
              <div class="py-5"> {{ customer.email }} </div>
            </v-col>
            <v-col cols="2"> 
              <div class="py-5"> {{ customer.vatin }} </div>
            </v-col>
            <v-col cols="1">
              <div class="py-5">
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
                    <v-btn v-bind="attrs" v-on="on" icon  @click="removeCustomer(customer._id)">  
                        <v-icon class="error--text">mdi-delete-outline</v-icon>           
                      </v-btn>
                  </template>
                  <span>Удалить клиента</span>
                </v-tooltip> 
              </div>
            </v-col>            
          </v-row>
         </div>
        <div v-else class="text-center"> Нет клиентов </div> 
      </v-card-text>
   </v-card>
 </v-container>
</template>

<script>
import CreateCustomer from './createCustomer.vue'
export default {
  name: 'customers',
  components: {
    CreateCustomer
  },
  data() {
    return {
      dialogCreateCustomer: false
    }
  }, 
  mounted() {
    this.$store.dispatch('customer/getCustomers')
  },
  computed: {
    customers() {
      return this.$store.state.customers.customers
    },
  },
  methods: {
    removeCustomer(id) {
      this.$store.dispatch('customer/removeCustomer', id)
    }
  }
}
</script>