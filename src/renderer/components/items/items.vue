<template>
  <div class="mx-auto  px-2 py-2" >

    <!-- верхнаяя панель инструментов -->

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">     
        <v-btn
          v-bind="attrs" v-on="on"
          color="primary"
          class="my-1 mx-3"
          text
          @click.stop="dialogCreateItem = true"      
        >
          <v-icon text-caption left>mdi-plus</v-icon><v-icon left>mdi-package-variant</v-icon> 
        </v-btn>
      </template>
      <span>Добавить товар</span>
    </v-tooltip>   

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">  
        <v-btn
          v-bind="attrs" v-on="on"
          color="primary"
          class="my-1 mx-3"
          text
          @click.stop="dialogCreateFolder = true"
        >
          <v-icon text-caption left>mdi-plus</v-icon> <v-icon text-caption left>mdi-folder-open-outline</v-icon> 
        </v-btn>
      </template>
      <span>Создать каталог</span>
    </v-tooltip>  

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">  
        <v-btn
          v-bind="attrs" v-on="on"
          :disabled="!selectedItems.length && !selectedFolders.length"
          color="error"
          text
          @click.stop="remove()"
          class="my-1 mx-3"
        >
          <v-icon text-caption>mdi-delete-outline</v-icon> 
        </v-btn>
        </template>
      <span>Удалить выбранное</span>
    </v-tooltip> 

    
    <!-- Список товаров и каталогов -->
    
    <v-card >
      <v-container fluid>

        <!-- кнопка "назад", в прошлый каталог -->

        <v-row class="text-center">
          <v-col cols="1">
          </v-col>
          <v-col cols="1">
            Код
          </v-col>
          <v-col cols="5">
            Наименование
          </v-col>
          <v-col cols="2">
            Цена
          </v-col>
          <v-col cols="3">
            Редактировать
          </v-col>
        </v-row>

        <v-row v-if="$route.query.folder != 'root'">
          <v-col cols="10"  offset="2"
            @click="back()"
          >
            <v-icon>mdi-folder-upload-outline</v-icon>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="10" offset="2">
            <v-icon>mdi-folder-home</v-icon>
          </v-col>
        </v-row>

        <!-- папки -->
        <div  v-if="folders.length || items.length"> 
        <v-row v-for="folder in folders" :key="folder._id" >
          <v-col cols="1">
            <v-checkbox hide-details class="shrink mx-0 my-0"  v-model="selectedFolders" :value="folder._id"></v-checkbox>
          </v-col>
      
          <v-col cols="1">

          </v-col>

          <v-col cols="7"  
            @click="$router.push({
              path: '/dashboard/items',
              query: {
                      folder: folder._id,
                  }
            })"
          >
            <v-icon class="mr-4">mdi-folder-open-outline</v-icon>   {{folder.title}}
          </v-col>

          <v-col cols="3" class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="folderForUpdate = Object.assign({}, folder); dialogUpdateFolder = true">  
                    <v-icon class="warning--text">mdi-pen</v-icon>           
                  </v-btn>
              </template>
              <span>Изменить</span>
            </v-tooltip> 
          </v-col>
          
        </v-row>

        <!-- товары -->

        <v-row v-for="item in items" :key="item._id">
          <v-col cols="1">
            <v-checkbox hide-details class="shrink mx-0 my-0" v-model="selectedItems" :value="item._id"></v-checkbox>
          </v-col>     

          <v-col cols="1" class="text-center">
            {{ item.code }}
          </v-col>            
            
          <v-col cols="5">
              <v-icon class="mr-4">mdi-package-variant-closed</v-icon>  {{item.title}}
          </v-col>
                    
          <v-col cols="2" class="text-center">
              {{item.price}}
          </v-col>

          <v-col cols="3" class="text-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon @click="itemForUpdate = Object.assign({}, item); dialogUpdateItem = true">  
                    <v-icon class="warning--text">mdi-pen</v-icon>           
                  </v-btn>
              </template>
              <span>Изменить</span>
            </v-tooltip> 
          </v-col>

          
        </v-row>
      </div>
      <div v-else class="py-3 px-3 text-center">
      Товаров и услуг нет
    </div>
      </v-container>
    </v-card>

    <!-- диалоговые окна -->
    
    <v-dialog v-model="dialogCreateItem" min-width="80%" >
        <create-item @itemWasCreated="itemWasCreated"/>
    </v-dialog>

    <v-dialog v-model="dialogUpdateItem" min-width="80%" >
      <update-item @itemWasUpdated="itemWasUpdated" :itemForUpdate="itemForUpdate"/>
    </v-dialog>

    <v-dialog v-model="dialogCreateFolder" min-width="80%" >
      <create-folder @folderWasCreated="folderWasCreated" />
    </v-dialog>

    <v-dialog v-model="dialogUpdateFolder" min-width="80%" >
      <update-folder @folderWasUpdated="folderWasUpdated" :folderForUpdate="folderForUpdate"/>
    </v-dialog>

    
    <alert :alert="alert" :timeout="5000"/>

     <scanner-com-port @scan-data-matrix="scanFromComPortDataMatrix" @scan-ean13="scanFromComPortEan13" />

  </div>  
</template>

<script>
import { findFolderParent } from '../../store/dbAPI/items/findFolderParent'

import ScannerComPort from './../equipment/scanner-com-port' //в перспективе нужен для поиска товара
import CreateItem from './create-item.vue'
import UpdateItem from './update-item.vue'
import CreateFolder from './create-folder.vue'
import UpdateFolder from './update-folder.vue'
import Alert from '../alerts/alert'

export default {
    name: 'items',  
    components: {
      Alert, ScannerComPort, CreateItem, UpdateItem, CreateFolder, UpdateFolder
    },
    data() {
      return {
        dialogCreateItem: false,
        dialogCreateFolder: false,
        dialogUpdateItem: false,
        dialogUpdateFolder: false,
        selectedItems: [],
        selectedFolders: [],
        itemForUpdate: {},
        folderForUpdate: {}
      }
    },
    mounted() {      
      //берем из URL ID родительского каталога
      this.$store.dispatch('items/getItems', this.$route.query.folder)
      this.$store.dispatch('items/getFolders', this.$route.query.folder)
    },
    watch: {
        '$route' (to, from) {           
          // при смене роута подтягиваем из БД дочерние каталоги и товары этого каталога
          this.$store.dispatch('items/getFolders', this.$route.query.folder)
          this.$store.dispatch('items/getItems', this.$route.query.folder)
          // лучше сбросить выделение во избежание удаления из разных папок и непредсказуемых последствий
          this.selectedItems = []
          this.selectedFolders = []
        },
    },
    computed: {
      /*
      осавил для примере геттера
      foldersAndItems() {
        return this.$store.getters['items/getFoldersAndItems']
      },
      */
      // только запрошенные каталоги в зависимости от URL
      folders() {
        return this.$store.state.items.folders
      },
      items() {
        return this.$store.state.items.items
      },  
      alert() {
        return this.$store.state.items.alert
      },
      
    },
    methods: { 
      
      //удаляет и item и folder
      remove() { 
           
        if (this.selectedItems.length) {
          let items = []
          this.selectedItems.forEach(element => {
            items.push(this.items.find(item => item._id == element))
          });
          
          this.$store.dispatch('items/removeItems', items)
          this.selectedItems = []
        }
        if (this.selectedFolders.length) {
          this.$store.dispatch('items/removeFolders', this.selectedFolders)
          this.selectedFolders = []
        }    
      },
      back() {
        let app = this
        findFolderParent(this.$route.query.folder).then(parent => {
          console.log(parent)
          app.$router.push({
            path: '/dashboard/items',
            query: {
              folder: parent,
            }
          })
        });
      },
      itemWasCreated() {
        this.dialogCreateItem = false
      },
      itemWasUpdated() {
        this.dialogUpdateItem= false
      },
      folderWasCreated() {
        this.dialogCreateFolder = false
      },
      folderWasUpdated() {
        this.dialogUpdateFolder = false
      },
      scanFromComPortDataMatrix(code) {
        console.log('доб', code )
      },
      scanFromComPortEan13(code) {
        console.log('доб', code )
      },
    }
  }
</script>

<style>
  
</style>
