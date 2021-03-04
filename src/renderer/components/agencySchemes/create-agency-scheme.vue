<template>
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
            Создание агентской схемы
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form @submit.prevent="createAgencyScheme()" ref="formCreateAgencyScheme" v-model="valid" lazy-validation>
        <v-card-text>

            <v-select
              v-model="agencyScheme.agents"
              :items="agents"
              label="Агентская деятельность"
              multiple
              chips
              persistent-hint
            ></v-select>

            <v-text-field
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent"))'
              placeholder='Операция платежного агента, например "Оплата"'
              v-model="agencyScheme.payingAgent.operation"
            ></v-text-field>

            <form 
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent") || agencyScheme.agents.includes("payingAgent") || agencyScheme.agents.includes("payingSubagent"))'
              @submit.prevent="addPayingAgentPhone()"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="4" >
                    <v-text-field
                      v-model="payingAgentPhone"
                      label="Телефон платежного агента"
                      append-icon="mdi-plus"
                      @click:append="addPayingAgentPhone()"
                    ></v-text-field>
                    <v-btn class="d-none" type="submit"> </v-btn>
                  </v-col>
                  <v-col cols="12" md="8" >
                    <v-chip
                      v-for="(phone, key) in agencyScheme.payingAgent.phones" :key="key"
                      class="ma-2"
                      color="secondary"
                      text-color="white"
                    >
                      {{ phone }}
                      <v-btn  @click="agencyScheme.payingAgent.phones.splice(key, 1)" icon>  
                        <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                      </v-btn>
                    </v-chip> 
                  </v-col>
                </v-row>
              </v-container>                    
            </form>

            <form
              v-if='(agencyScheme.agents.includes("payingAgent") || agencyScheme.agents.includes("payingSubagent"))'
              @submit.prevent="addReceivePaymentsOperatorPhone()"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="4" >
                    <v-text-field
                      v-model="receivePaymentsOperatorPhone"
                      label="Телефон оператора по приему платежей"
                      append-icon="mdi-plus"
                      @click:append="addReceivePaymentsOperatorPhone()"
                    ></v-text-field>
                    <v-btn class="d-none" type="submit"> </v-btn> 
                  </v-col>
                  <v-col cols="12" md="8" >  
                    <v-chip
                      v-for="(phone, key) in agencyScheme.receivePaymentsOperator.phones" :key="key"
                      class="ma-2"
                      color="secondary"
                      text-color="white"
                    >
                      {{ phone }}
                      <v-btn  @click="agencyScheme.receivePaymentsOperator.phones.splice(key, 1)" icon>  
                        <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                      </v-btn>
                    </v-chip> 
                  </v-col>
                </v-row>
              </v-container>                    
            </form>

            <form 
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent"))'
              @submit.prevent="addMoneyTransferOperatorPhone()">
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="4" >
                    <v-text-field
                      v-model="moneyTransferOperatorPhone"
                      label="Телефон оператора перевода"
                      append-icon="mdi-plus"
                      @click:append="addMoneyTransferOperatorPhone()"
                    ></v-text-field>
                    <v-btn class="d-none" type="submit"> </v-btn> 
                  </v-col>
                  <v-col cols="12" md="8" >    
                    <v-chip
                      v-for="(phone, key) in agencyScheme.moneyTransferOperator.phones" :key="key"
                      class="ma-2"
                      color="secondary"
                      text-color="white"
                    >
                      {{ phone }}
                      <v-btn  @click="agencyScheme.moneyTransferOperator.phones.splice(key, 1)" icon>  
                        <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                      </v-btn>
                    </v-chip>  
                  </v-col>
                </v-row>
              </v-container>                   
            </form>

            <v-text-field
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent"))'
              placeholder="Наименование оператора перевода"
              v-model="agencyScheme.moneyTransferOperator.name"
            ></v-text-field> 

            <v-text-field
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent"))'
              placeholder="Адрес оператора перевода"
              v-model="agencyScheme.moneyTransferOperator.address"
            ></v-text-field> 

            <v-text-field
              v-if='(agencyScheme.agents.includes("bankPayingAgent") || agencyScheme.agents.includes("bankPayingSubagent"))'
              placeholder="ИНН оператора перевода"
              v-model="agencyScheme.moneyTransferOperator.vatin"
              :rules="vatinRules"
            ></v-text-field>

            <v-select
              v-model="agencyScheme.supplier"
              :items="suppliers"
              label="Выберите поставщика"
              persistent-hint
            ></v-select>

            <div v-if="agencyScheme.supplier">

              <v-text-field
                placeholder="ИНН поставщика"
                v-model="agencyScheme.supplier.vatin"
                disabled
                :rules="vatinRules"
              ></v-text-field>

            Телефоны поставщика: 
              
              <v-chip              
                v-for="(phone, key) in agencyScheme.supplier.phones" :key="key"
                class="ma-2"
                color="secondary"
                text-color="white"
              >
                {{ phone }}
              </v-chip> 

            </div>

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

import agents from '../resources/agents.js'
export default {
  name: 'create-agency-scheme',
  data() {
    return {
      agents,
      payingAgentPhone: "",
      receivePaymentsOperatorPhone: "",
      moneyTransferOperatorPhone: "",
      valid:true,
      agencyScheme: {
        agents: [],
        payingAgent: {
            operation: "",
            phones: []
        },
        receivePaymentsOperator: {
            phones: []
        },
        moneyTransferOperator: {
              phones: [],
              name: "",
              address: "",
              vatin: ""
        },
        supplier: null
      },
      supplierPhone:"",      
    }    
  },
  mounted() {
    this.$store.dispatch('suppliers/getSuppliers')
  },
  computed: {
    suppliers() {
      if (this.$store.state.suppliers.suppliers.length) {
        let suppliers = []
        this.$store.state.suppliers.suppliers.forEach(supplier => {
          suppliers.push({
            text: supplier.name,
            value: supplier
          })
        }); 
        return suppliers
      } else {
        return []
      }
    },
    vatinRules() {
      if (this.agencyScheme.moneyTransferOperator.vatin) {
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
    addPayingAgentPhone() {
      if (this.payingAgentPhone) {
        this.agencyScheme.payingAgent.phones.push(this.payingAgentPhone)
        this.payingAgentPhone = ""
      }      
    },
    addReceivePaymentsOperatorPhone() {
      if (this.receivePaymentsOperatorPhone) {
        this.agencyScheme.receivePaymentsOperator.phones.push(this.receivePaymentsOperatorPhone)
        this.receivePaymentsOperatorPhone = ""
      }      
    },
    addMoneyTransferOperatorPhone() {
      if (this.moneyTransferOperatorPhone) {
        this.agencyScheme.moneyTransferOperator.phones.push(this.moneyTransferOperatorPhone)
        this.moneyTransferOperatorPhone = ""
      }      
    },
    createAgencyScheme() {
      if (this.$refs.formCreateAgencyScheme.validate()) {
        this.$store.dispatch('agencySchemes/createAgencyScheme', this.agencyScheme )
        this.agencyScheme = {
          agents: [],
          payingAgent: {
              operation: "",
              phones: []
          },
          receivePaymentsOperator: {
              phones: []
          },
          moneyTransferOperator: {
                phones: [],
                name: "",
                address: "",
                vatin: ""
          }
        }        
        this.$refs.formCreateAgencyScheme.resetValidation()
        this.$emit('close-dialog')       
      }      
    }
  }
}
</script>