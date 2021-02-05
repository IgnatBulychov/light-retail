<template>
    <v-card>
    <v-card-title>
      Клиенты
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search-mdi"
        label="Поиск"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
        

    <v-data-table
    :headers="headers"
    :items="customers"
    item-key="name"
    class="elevation-1"
    :search="search"
    @click:row="customerWasSelected"
  >
    
  </v-data-table>


  </v-card>
</template>

<script>
 export default {
    name: 'add-customer',

    data() {
      return {
        search: '',
        headers: [
          {
            text: 'Имя/Название',
            align: 'left',
            value: 'name',
          }
        ],
        singleSelect: true,
        selected: {}
      }
    },
    mounted() {
      this.$store.dispatch('customers/getCustomers')
    },
    computed: {
      customers() {
        return this.$store.state.customers.customers
      },
    },
    methods: {
      customerWasSelected(selected, data) {
       
          this.$emit('customerWasSelected',selected)
           console.log(selected)
        
       
      }
    }
  }
</script>

<style>
  
</style>