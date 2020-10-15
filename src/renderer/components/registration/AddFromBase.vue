<template>
    <v-card>
    <v-card-title>
      Товары и услуги
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
      :items="items"
      :search="search"
    ></v-data-table>
  </v-card>
</template>

<script>
 export default {
    name: 'add-from-base',

    data() {
      return {
         search: '',
         headers: [
          {
            text: 'Наименование',
            align: 'left',
            value: 'title',
          },
          { 
            text: 'Цена', 
            value: 'price' 
          },
          { 
            text: 'Штрихкод', 
            value: 'code' 
          }
        ],
      }
    },
    mounted() {
      this.$store.dispatch('items/getItems')
    },
    computed: {
      items() {
        return this.$store.state.items.items;
      }
    },
    methods: {
   
    }
  }
</script>

<style>
  
</style>