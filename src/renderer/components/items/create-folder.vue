<template>
  <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="folder.title"
              label="Наименование"
          ></v-text-field>
          
          <v-select
            :items="taxationTypes"
            label="СНО товаров или услуг каталога"
            v-model="folder.taxationType"
          ></v-select>
          <v-btn class="success" @click="createFolder()">Создать каталог</v-btn>
        </v-card-text>
      </v-card>
</template>

<script>
import taxationTypes from '../resources/taxationTypes.js'
export default {
    name: 'create-folder',  

    data() {
      return {
         folder:{
              title: '',
              parent: "root",
              taxationType: null
          },
          taxationTypes: taxationTypes,
      }
    },
    methods: { 
      createFolder() {
        // указываем родительский каталог для нового каталога
        this.folder.parent = this.$route.query.folder
        this.$store.dispatch('items/createFolder', this.folder)
        //сброс формы создания каталога
        
        this.folder = {
            title: ''
        }
        this.$emit('folderWasCreated')
      },
    }
}
</script>