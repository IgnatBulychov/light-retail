<template>
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
            Изменение агентской схемы
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form @submit.prevent="updateAgencyScheme()" ref="formUpdateAgencyScheme" v-model="valid" lazy-validation>
        <v-card-text>

            <v-select
              v-model="agencySchemeForUpdate.agents"
              :items="agents"
              label="Агентская деятельность"
              multiple
              chips
              persistent-hint
            ></v-select>

            <v-text-field
              placeholder='Операция платежного агента, например "Оплата"'
              v-model="agencySchemeForUpdate.payingAgent.operation"
            ></v-text-field> 

            <form @submit.prevent="addPayingAgentPhone()">
              <v-text-field
                v-model="payingAgentPhone"
                label="Телефон платежного агента"
              ></v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                      <v-icon class="warning--text">mdi-plus</v-icon>           
                    </v-btn>
                </template>
                <span>Добавить телефон</span>
              </v-tooltip> 
              <v-chip
                v-for="(phone, key) in agencySchemeForUpdate.payingAgent.phones" :key="key"
                class="ma-2"
                color="secondary"
                text-color="white"
              >
                {{ phone }}
                <v-btn  @click="agencySchemeForUpdate.payingAgent.phones.splice(key, 1)" icon>  
                  <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                </v-btn>
              </v-chip>                    
            </form>

            <form @submit.prevent="addReceivePaymentsOperatorPhone()">
              <v-text-field
                v-model="receivePaymentsOperatorPhone"
                label="Телефон оператора по приему платежей"
              ></v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                      <v-icon class="warning--text">mdi-plus</v-icon>           
                    </v-btn>
                </template>
                <span>Добавить телефон</span>
              </v-tooltip> 
              <v-chip
                v-for="(phone, key) in agencySchemeForUpdate.receivePaymentsOperator.phones" :key="key"
                class="ma-2"
                color="secondary"
                text-color="white"
              >
                {{ phone }}
                <v-btn  @click="agencySchemeForUpdate.receivePaymentsOperator.phones.splice(key, 1)" icon>  
                  <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                </v-btn>
              </v-chip>                    
            </form>

            <form @submit.prevent="addMoneyTransferOperatorPhone()">
              <v-text-field
                v-model="moneyTransferOperatorPhone"
                label="Телефон оператора перевода"
              ></v-text-field>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                      <v-icon class="warning--text">mdi-plus</v-icon>           
                    </v-btn>
                </template>
                <span>Добавить телефон</span>
              </v-tooltip> 
              <v-chip
                v-for="(phone, key) in agencySchemeForUpdate.moneyTransferOperator.phones" :key="key"
                class="ma-2"
                color="secondary"
                text-color="white"
              >
                {{ phone }}
                <v-btn  @click="agencySchemeForUpdate.moneyTransferOperator.phones.splice(key, 1)" icon>  
                  <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                </v-btn>
              </v-chip>                    
            </form>

            <v-text-field
              placeholder="Наименование оператора перевода"
              v-model="agencySchemeForUpdate.moneyTransferOperator.name"
            ></v-text-field> 

            <v-text-field
              placeholder="Адрес оператора перевода"
              v-model="agencySchemeForUpdate.moneyTransferOperator.address"
            ></v-text-field> 

            <v-text-field
              placeholder="ИНН оператора перевода"
              v-model="agencySchemeForUpdate.moneyTransferOperator.vatin"
              :rules="vatinRules"
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
</template>

<script>

import agents from '../resources/agents.js'
export default {
  name: 'update-agency-scheme',
  props: ['agencySchemeForUpdate'],
  data() {
    return {
      agents,
      payingAgentPhone: "",
      receivePaymentsOperatorPhone: "",
      moneyTransferOperatorPhone: "",
      valid:true,
    }
  },
  computed: {
    vatinRules() {
      if (this.agencySchemeForUpdate.moneyTransferOperator.vatin) {
        return [
          v => (v.length == 0 || v.length == 12) || 'Некорректный ИНН',
          v =>  /^\d+$/.test(v) || 'Некорректный ИНН'       
        ]
      } else {
        return []
      }
    } 
  },
  methods: {
    updateAgencyScheme() {
      if (this.$refs.formUpdateAgencyScheme.validate()) {
        this.$store.dispatch('agencySchemes/updateAgencyScheme', this.agencySchemeForUpdate)        
        this.$refs.formUpdateAgencyScheme.resetValidation()
        this.$emit('close-dialog')       
      }      
    }
  }
}
</script>