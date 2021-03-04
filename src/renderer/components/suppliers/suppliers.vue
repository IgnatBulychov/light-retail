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
              @click.stop="dialogCreateSupplier = true"
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
          @keydown.esc="dialogCreateSupplier = false"
          max-width="50%"
          v-model="dialogCreateSupplier"  
          v-on:click:outside="dialogCreateSupplier = false" 
        >
          <create-supplier @close-dialog="dialogCreateSupplier = false"/>
        </v-dialog>

        <v-dialog 
          eager 
          @keydown.esc="dialogUpdateSupplier = false"
          max-width="50%"
          v-model="dialogUpdateSupplier"  
          v-on:click:outside="dialogUpdateSupplier = false" 
        >
          <update-supplier :supplierForUpdate="supplierForUpdate" @close-dialog="dialogUpdateSupplier = false"/>
        </v-dialog>

        <div v-if="suppliers.length">
          <v-row v-for="(supplier, key) in suppliers" :key="supplier._id">            
            <v-col cols="1">
              <div class="py-5"> {{ key + 1 }} </div>
            </v-col>
            <v-col cols="4">                   
              <div class="py-5"> {{ supplier.name }} </div>
            </v-col>
            <v-col cols="2"> 
              <div class="py-5"> 
                <v-chip
                  v-for="(phone, key) in supplier.phones" :key="key"
                  class="ma-2"
                  color="secondary"
                  text-color="white"
                >
                  {{ phone }}
                </v-chip>  
              </div>
            </v-col>            
            <v-col cols="4"> 
              <div class="py-5"> {{ supplier.vatin }} </div>
            </v-col>
            <v-col cols="1">
              <div class="py-5">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon @click="supplierForUpdate = Object.assign({}, supplier); dialogUpdateSupplier = true">  
                        <v-icon class="warning--text">mdi-pen</v-icon>           
                      </v-btn>
                  </template>
                  <span>Изменить поставщика</span>
                </v-tooltip> 
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" icon  @click="removeSupplier(supplier._id)">  
                        <v-icon class="error--text">mdi-delete-outline</v-icon>           
                      </v-btn>
                  </template>
                  <span>Удалить поставщика</span>
                </v-tooltip> 
              </div>
            </v-col>            
          </v-row>
         </div>
        <div v-else class="text-center"> Нет поставщиков </div> 
      </v-card-text>
   </v-card>
 </v-container>
</template>

<script>
import CreateSupplier from './createSupplier'
import UpdateSupplier from './updateSupplier'
export default {
  name: 'suppliers',
  components: {
    CreateSupplier, UpdateSupplier
  },
  data() {
    return {
      dialogCreateSupplier: false,
      supplierForUpdate: {
        name: "",
        vatin: "",
        phones: []
      },
      dialogUpdateSupplier: false
    }
  }, 
  mounted() {
    this.$store.dispatch('suppliers/getSuppliers')
  },
  computed: {
    suppliers() {
      return this.$store.state.suppliers.suppliers
    },
  },
  methods: {
    removeSupplier(id) {
      this.$store.dispatch('suppliers/removeSupplier', id)
    }
  }
}
</script>