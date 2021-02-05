<template>
  <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="folderForUpdate.title"
              label="Наименование"
          ></v-text-field>
          
          <v-select
            :items="taxationTypes"
            label="СНО товаров или услуг каталога"
            v-model="folderForUpdate.taxationType"
          ></v-select>               
          <v-btn class="success" @click="updateFolder()">Изменить каталог</v-btn>
        </v-card-text>
      </v-card>
</template>

<script>
import taxationTypes from '../resources/taxationTypes.js'
export default {
    name: 'update-folder',  
  props: ['folderForUpdate'],
    data() {
      return {
          
           taxationTypes,
      }
    },
    methods: { 
      updateFolder() {
        this.$store.dispatch('items/updateFolder', this.folderForUpdate)
        this.$emit('folderWasUpdated')
      },

    }
}
</script>