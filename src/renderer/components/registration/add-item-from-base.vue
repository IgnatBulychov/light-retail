<template>
<v-card min-height="90vh">
    <v-card-title>
      
      <v-text-field
        v-model="search"
        append-icon="search-mdi"
        label="Поиск по названию или артикулу"
        placeholder="Поиск по названию или артикулу"
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
    :items-per-page="8"
    disable-pagination
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
          :items-per-page="8"
        ></v-data-table>

        <v-data-table
        v-if="search.length"
          :headers="headers"
          :items="foundItems"
          item-key="_id"
          :items-per-page="8"
          class="elevation-1"
          @click:row="selectItem"
        >
          
        </v-data-table>
      </v-col>
    </v-row>
  </v-card-text>
  </v-card>
</template>

<script>
import { findFolderParent } from '../../store/dbAPI/items/findFolderParent'
import { getFolderByID } from '../../store/dbAPI/items/getFolderByID';
import { getAgencySchemeFromBase } from '../../store/dbAPI/agencySchemes/getAgencyScheme';
import { getSupplierFromBase } from '../../store/dbAPI/suppliers/getSupplier';
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
     // this.$store.dispatch('items/getAllItems')
      this.$store.dispatch('items/getItems', this.$route.query.folder)
      this.$store.dispatch('items/getFolders', this.$route.query.folder)
    },
    watch: {
        '$route' (to, from) {           
          // при смене роута подтягиваем из БД дочерние каталоги и товары этого каталога
          this.$store.dispatch('items/getFolders', this.$route.query.folder)
          this.$store.dispatch('items/getItems', this.$route.query.folder)
       
        },
        'search': function() {
           this.$store.dispatch('items/getItemsBySearch', this.search)
        }
    },
    computed: {
      items() {
        return this.$store.state.items.items;
      },
      foundItems() {
        return this.$store.state.items.foundItems;
      },
      folders() {
        return this.$store.state.items.folders
      },
    },
    methods: {
      selectItem(item, data){
        let app = this
        
        async function buildItem(item) {

            let taxationType = null
            let agencyScheme = null

            if (item.parent != "root") {               
              let parent = await getFolderByID(item)
              taxationType = parent.taxationType
            }

            if (item.agencyScheme) {
              let agencySchemeFromBase = await getAgencySchemeFromBase(item.agencyScheme)
              let supplierFromBase = await getSupplierFromBase(agencySchemeFromBase.supplier)
              console.log(agencySchemeFromBase)
              agencyScheme = agencySchemeFromBase
              agencyScheme.supplier = supplierFromBase
            }

            item.taxationType = taxationType
            item.agencyScheme = agencyScheme
            return item
        }  

        buildItem(item)
        .then(item => {   
          app.$store.commit('itemAdditionManager/setItem', item)
          app.$emit('item-selected') 
        })
                  
       
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