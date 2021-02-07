<template>
  <v-card>
    <v-card-title>
        <span class="text-lg-h6">
          Настройки чека
        </span>
        <v-spacer></v-spacer>
          <v-btn icon @click="$emit('settings-was-saved')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
       
        <v-card-text text-center>
           <v-form>
          <v-select
            :items="checkTypes"
            label="Тип чека"
            v-model="checkType"
          ></v-select>     

          <v-select
            :items="taxationTypes"
            label="СНО чека"
            v-model="taxationType"
            
          ></v-select>           

        </v-form>
          <div v-if="customer">
            Покупатель:
          <v-form v-model="validCustomer" lazy-validation>
            
            <v-text-field
              placeholder="Название"
              v-model="customer.name"
              :rules="customerNameRules"
            ></v-text-field> 
            <v-text-field
              placeholder="ИНН"
              v-model="customer.vatin"
              :rules="customerVatinRules"
            ></v-text-field>    
            <v-text-field
              placeholder="Электронная почта"
              v-model="customer.email"
              :rules="customerEmailRules"
            ></v-text-field>   
            <v-text-field
              placeholder="Телефон"
              v-model="customer.phone"
              :rules="customerPhoneRules"
            ></v-text-field>                 
         </v-form>   
        </div>

       
        </v-card-text>
        <v-card-actions>    
           <v-spacer></v-spacer>
       <v-btn v-if="!customer" @click="dialogAddCustomer = true" color="green">
                Добавить реквизиты покупателя       
            </v-btn>  

             <v-btn v-if="customer" @click="customer = false" color="error">
                Удалить реквизиты покупателя       
            </v-btn> 
        
             <v-spacer></v-spacer>          
        </v-card-actions>


    <v-dialog eager 
      @keydown.esc="dialogAddCustomer = false"
      max-width="50%"
      v-model="dialogAddCustomer"  
      v-on:click:outside="dialogAddCustomer = false" 
    >
      <add-customer 
        @customer-was-selected="customerWasSelected"
      />
    </v-dialog>

      </v-card>
</template>

<script>

import taxationTypes from './../resources/taxationTypes'
import checkTypes from './../resources/checkTypes'
import AddCustomer from './add-customer'
export default {
  name: 'check-settings',
  components: {
      AddCustomer
  },
  data() {
    return {        
        checkTypes, taxationTypes,
        dialogAddCustomer: false,
        customerNameRules: [
            v => !!v || 'Название - обязательное поле'
        ],
        validCustomer: true,
    }
  },
  created() {
     this.$store.dispatch('settings/getSettings')
  },
  computed: {    
    taxationType: {
      get() {
        return this.$store.state.check.checkSettings.taxationType
      },
      set(v) {
        this.$store.commit('check/setTaxationType', v)
      }
    },
    checkType: {
      get() {
        return this.$store.state.check.checkSettings.checkType
      },
      set(v) {
        this.$store.commit('check/setCheckType', v)
      }
    },
    customer: {
      get() {
        return this.$store.state.check.checkSettings.customer
      },
      set(v) {
        this.$store.commit('check/setCustomer', v)
      }
    },
    customerEmailRules() {
      if (!this.customer.phone) {
        return [
          v => !!v || 'Заполните телефон или E-mail',
        ]
      } else {
        return []
      }      
    },
  customerPhoneRules () {
    if (!this.customer.email) {
      return [
        v => !!v || 'Заполните телефон или E-mail',
      ]
    } else {
      return []
    }      
  },
  customerVatinRules() {
    if (this.customer.vatin) {
      return [
        v => (v.length == 0 || v.length == 12) || 'Некорректный ИНН',
        v =>  /^\d+$/.test(v) || 'Некорректный ИНН'       
      ]
    } else {
      return []
    }
      },
  },
  methods: {
      customerWasSelected() {
          this.dialogAddCustomer = false
        },
  }
}
</script>