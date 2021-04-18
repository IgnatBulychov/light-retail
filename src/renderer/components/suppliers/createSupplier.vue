<template>
    <v-card>
      <v-card-title>
        <span class="text-lg-h6">
            Добавление поставщика
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close-dialog')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-form @submit.prevent="createSupplier()" ref="formCreateSupplier" v-model="valid" lazy-validation>
        <v-card-text>
            <v-text-field
              placeholder="Наименование поставщика"
              v-model="supplier.name"
            ></v-text-field>

            <v-text-field
              placeholder="ИНН поставщика"
              v-model="supplier.vatin"
              :rules="vatinRules"
            ></v-text-field>

            <form 
              @submit.prevent="addSupplierPhone()">
              <v-container fluid>
                <v-row>
                  <v-col cols="12" md="4" >
                    <v-text-field
                      v-model="supplierPhone"
                      label="Телефон поставщика"
                      append-icon="mdi-plus"
                      @click:append="addSupplierPhone()"
                    ></v-text-field>
                    <v-btn class="d-none" type="submit"> </v-btn> 
                  </v-col>
                  <v-col cols="12" md="8" >    
                    <v-chip
                      v-for="(phone, key) in supplier.phones" :key="key"
                      class="ma-2"
                      color="secondary"
                      text-color="white"
                    >
                      {{ phone }}
                      <v-btn  @click="supplier.phones.splice(key, 1)" icon>  
                        <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
                      </v-btn>
                    </v-chip>  
                  </v-col>
                </v-row>
              </v-container>                   
            </form>      
            
        </v-card-text>
      <v-card-actions>                    
        <v-btn type="submit" width="40%" height="50px" dark color="green lighten-2">
            Добавить       
        </v-btn>
        <v-spacer></v-spacer>          
      </v-card-actions>
    </v-form>   
  </v-card>
</template>

<script>
export default {
  name: 'create-supplier',
  data() {
    return {
      valid:true,
      supplier: {
        name: "",
        vatin: "",
        phones: []
      }, 
      supplierPhone: "",     
      nameRules: [
        v => !!v || 'Название - обязательное поле'
      ]
    }
  },
  computed: {
    vatinRules() {
      if (this.supplier.vatin) {
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
    createSupplier() {
      if (this.$refs.formCreateSupplier.validate()) {
        this.$store.dispatch('suppliers/createSupplier', this.supplier)
         this.supplier = {
          name: "",
          vatin: "",
          phones: []
        }
        this.$refs.formCreateSupplier.resetValidation()
        this.$emit('close-dialog')       
      }      
    },
    addSupplierPhone() {
      if (this.supplierPhone) {
        this.supplier.phones.push(this.supplierPhone)
        this.supplierPhone = ""
      } 
    },
  }
}
</script>