<template>
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
            Создание нового клиента
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form @submit.prevent="createCustomer()" ref="formCreateCustomer" v-model="valid" lazy-validation>
        <v-card-text>
        <v-text-field
          placeholder="Название"
          v-model="customer.name"
          :rules="nameRules"
        ></v-text-field> 
        <v-select
          :items="statuses"
          label="Статус"
          v-model="customer.status"
        ></v-select>  
        <v-text-field
          placeholder="ИНН"
          v-model="customer.vatin"
          :rules="vatinRules"
        ></v-text-field>    
        <v-text-field
          placeholder="Электронная почта"
          v-model="customer.email"
          :rules="emailRules"
        ></v-text-field>   
        <v-text-field
          placeholder="Телефон"
          v-model="customer.phone"
          :rules="phoneRules"
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
</template>

<script>
export default {
  name: 'create-customer',
  data() {
    return {
      valid:true,
      statuses:[
        {
          text: "Физическое лицо",
          value: "individual"
        },
          {
          text: "Юридическое лицо",
          value: "entity"
        }
      ],
      customer: {
        name: "",
        vatin: "",
        phone: "",
        email: "",
        status: 'individual'
      },      
      nameRules: [
        v => !!v || 'Название - обязательное поле'
      ]
    }
  },
  computed: {
    emailRules() {
      if (!this.customer.phone) {
        return [
          v => !!v || 'Заполните телефон или E-mail',
        ]
      } else {
        return []
      }      
    },
    phoneRules () {
      if (!this.customer.email) {
        return [
          v => !!v || 'Заполните телефон или E-mail',
        ]
      } else {
        return []
      }      
    },
    vatinRules() {
      if (this.customer.vatin) {
        return [
          v => (v.length == 0 || v.length == 12 || v.length == 10) || 'Некорректный ИНН',
          v =>  /^\d+$/.test(v) || 'Некорректный ИНН'       
        ]
      } else {
        return []
      }
    } 
  },
  methods: {
    createCustomer() {
      if (this.$refs.formCreateCustomer.validate()) {
        this.$store.dispatch('customers/createCustomer', this.customer)
         this.customer = {
          name: "",
          vatin: "",
          phone: "",
          email: "",
          status: 'individual'
        }
        this.$refs.formCreateCustomer.resetValidation()
        this.$emit('close-dialog')       
      }      
    }
  }
}
</script>