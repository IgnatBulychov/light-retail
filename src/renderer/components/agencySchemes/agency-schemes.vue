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
              @click.stop="dialogCreateAgencyScheme = true"
            >
              <v-icon>mdi-plus</v-icon> 
            </v-btn>
          </template>
          <span>Добавить агентскую схему</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-dialog 
          eager 
          @keydown.esc="dialogCreateAgencyScheme = false"
          max-width="80%"
          v-model="dialogCreateAgencyScheme"  
          v-on:click:outside="dialogCreateAgencyScheme = false" 
        >
          <create-agency-scheme @close-dialog="dialogCreateAgencyScheme = false"/>
        </v-dialog>

        <v-dialog 
          eager 
          @keydown.esc="dialogUpdateAgencyScheme = false"
          max-width="80%"
          v-model="dialogUpdateAgencyScheme"  
          v-on:click:outside="dialogUpdateAgencyScheme = false" 
        >
          <update-agency-scheme :agencySchemeForUpdate="agencySchemeForUpdate" @close-dialog="dialogUpdateAgencyScheme = false"/>
        </v-dialog>

        <div v-if="agencySchemes.length">
          <v-row>            
            <v-col cols="1">
              #
            </v-col>
            <v-col cols="3">
              Деятельность
            </v-col>
            <v-col cols="5">
              Принципал
            </v-col>
            <v-col cols="3">
              Действия
            </v-col>
          </v-row>
          <v-row v-for="(agencyScheme, key) in agencySchemes" :key="agencyScheme._id">            
            <v-col cols="1">
              <div class="py-5"> {{ key + 1 }} </div>
            </v-col>
            <v-col cols="3">                   
              <div  class="py-5">       
                <v-chip
                  v-for="(agent, key) in agencyScheme.agents" :key="key"
                  class="ma-2"
                  color="secondary"
                  text-color="white"
                >         
                  {{ agents.find(item => item.value == agent).text }}
                </v-chip>
              </div>
            </v-col>
            <v-col cols="5">                   
               <div class="py-5">
                  {{  agencyScheme.supplier.name  }}  
               </div>            
            </v-col>
            <v-col cols="3">
              <div class="py-5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon @click="agencySchemeForUpdate = Object.assign({}, agencyScheme); dialogUpdateAgencyScheme = true">  
                        <v-icon class="warning--text">mdi-pen</v-icon>           
                      </v-btn>
                  </template>
                  <span>Изменить агентскую схему</span>
                </v-tooltip> 
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon  @click="removeAgencyScheme(agencyScheme._id)">  
                        <v-icon class="error--text">mdi-delete-outline</v-icon>           
                      </v-btn>
                  </template>
                  <span>Удалить агентскую схему</span>
                </v-tooltip> 
              </div>
            </v-col>            
          </v-row>
         </div>
        <div v-else class="text-center"> Нет агентских схем </div> 
      </v-card-text>
   </v-card>
 </v-container>
</template>

<script>
import CreateAgencyScheme from './create-agency-scheme.vue'
import UpdateAgencyScheme from './update-agency-scheme.vue'
import agents from '../resources/agents.js'
export default {
  name: 'agency-schemes',
  components: {
    CreateAgencyScheme, UpdateAgencyScheme
  },
  data() {
    return {
      dialogCreateAgencyScheme: false,
      dialogUpdateAgencyScheme: false,
      agents,
      agencySchemeForUpdate: {
        agents: [],
        payingAgent: {
            operation: "Оплата",
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
    }
  }, 
  mounted() {
    this.$store.dispatch('agencySchemes/getAgencySchemes')
  },
  computed: {
    agencySchemes() {
      return this.$store.state.agencySchemes.agencySchemes
    },
  },
  methods: {
    removeAgencyScheme(id) {
      this.$store.dispatch('agencySchemes/removeAgencyScheme', id)
    },
  }
}
</script>