<template>
<v-card min-height="90vh">
    <v-card-title>
      
      <v-text-field
        v-model="search"
        append-icon="search-mdi"
        label="Поиск по названию, артикулу или цене"
        placeholder="Поиск по названию, артикулу или цене"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-if="!search.length" cols=12 md=6>
Каталоги:
<v-row v-if="$route.query.folder != 'root'">
          <v-col cols="10"  
            @click="back()"
          >
            <v-icon>mdi-folder-upload-outline</v-icon>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="10">
            <v-icon>mdi-folder-home</v-icon>
          </v-col>
        </v-row>
         
    <v-data-table
    :headers="headers"
    :items="folders"
    item-key="_id"
    color="primary lighten-4"
    class="elevation-1"
    @click:row="goToFolder"
    hide-default-header
    hide-default-footer
  >
    
  </v-data-table>
     </v-col>
      <v-col cols=12 :md="search.length ? 12 : 6">
Товары:
<v-data-table
v-if="!search.length"
    :headers="headers"
    :items="items"
     item-key="_id"
    class="elevation-1"
    @click:row="selectItem"
    hide-default-footer
  ></v-data-table>

  <v-data-table
  v-if="search.length"
    :headers="headers"
    :items="allItems"
    item-key="_id"
    class="elevation-1"
    :search="search"
    @click:row="selectItem"
    hide-default-footer
  >
    
  </v-data-table>
</v-col>
          </v-row>
        </v-card-text>

  </v-card>
</template>

<script>
import { findFolderParent } from '../../store/dbAPI/items/findFolderParent'
 export default {
    name: 'add-item-from-base',

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
            text: 'Артикул', 
            value: 'vendorCode' 
          },
          { 
            text: 'Цена', 
            value: 'price' 
          }
        ],
      }
    },
    mounted() {
      this.$store.dispatch('items/getAllItems')
      this.$store.dispatch('items/getItems', this.$route.query.folder)
      this.$store.dispatch('items/getFolders', this.$route.query.folder)
    },
    watch: {
        '$route' (to, from) {           
          // при смене роута подтягиваем из БД дочерние каталоги и товары этого каталога
          this.$store.dispatch('items/getFolders', this.$route.query.folder)
          this.$store.dispatch('items/getItems', this.$route.query.folder)
       
        },
    },
    computed: {
      items() {
        return this.$store.state.items.items;
      },
      allItems() {
        return this.$store.state.items.allItems;
      },
      folders() {
        return this.$store.state.items.folders
      },
    },
    methods: {
      selectItem(){

      },
      goToFolder(folder) {
        this.$router.push({
              path: '/dashboard/registration',
              query: {
                      folder: folder._id,
                  }
            })
      },
      back() {
        let app = this
        findFolderParent(this.$route.query.folder).then(parent => {
          console.log(parent)
          app.$router.push({
            path: '/dashboard/registration',
            query: {
              folder: parent,
            }
          })
        });
      },
    }
  }
</script>

<style>
  
</style>