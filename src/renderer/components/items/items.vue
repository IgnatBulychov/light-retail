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

    <!-- диалоговые окна -->
    
    <v-dialog v-model="dialogCreateItem" min-width="80%" >
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="item.title"
              label="Наименование"
          ></v-text-field>
          <v-text-field
              v-model="item.price"
              label="Цена"
          ></v-text-field>                  
          <v-text-field
              v-model="item.costPrice"
              label="Цена со скидкой"
          ></v-text-field>
          <form @submit.prevent="addBarcode()">
            <v-text-field
                v-model="barcode"
                label="Штрихкод"
            ></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                    <v-icon class="warning--text">mdi-plus</v-icon>           
                  </v-btn>
              </template>
              <span>Добавить штрихкод</span>
            </v-tooltip> 
            <v-chip
              v-for="(barcode, key) in item.barcodes" :key="key"
              class="ma-2"
              color="secondary"
              text-color="white"
            >
              {{ barcode }}
              <v-btn  @click="item.barcodes.splice(key, 1)" icon>  
                <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
              </v-btn>
            </v-chip>                    
          </form>
          <v-switch
            v-model="item.mark"
            color="green"
            label="Маркированный товар"
          ></v-switch>
          <v-select
            :items="measureNames"
            label="Единица измерения"
            v-model="item.measureName"
          ></v-select>
          <v-select
            :items="taxes"
            label="Налоговая ставка"
            v-model="item.tax"
          ></v-select>
          <v-btn class="success" @click="createItem()">Создать товар</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogUpdateItem" min-width="80%" >
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="itemForUpdate.title"
              label="Наименование"
          ></v-text-field>
          <v-text-field
              v-model="itemForUpdate.price"
              label="Цена"
          ></v-text-field>                  
          <v-text-field
              v-model="itemForUpdate.costPrice"
              label="Цена со скидкой"
          ></v-text-field>
          <form @submit.prevent="addBarcodeToItemForUpdate()">
            <v-text-field
                v-model="barcodeForItemForUpdate"
                label="Штрихкод"
            ></v-text-field>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon type="submit">  
                    <v-icon class="warning--text">mdi-plus</v-icon>           
                  </v-btn>
              </template>
              <span>Добавить штрихкод</span>
            </v-tooltip> 
            <v-chip
              v-for="(barcode, key) in itemForUpdate.barcodes" :key="key"
              class="ma-2"
              color="secondary"
              text-color="white"
            >
              {{ barcode }}
              <v-btn  @click="itemForUpdate.barcodes.splice(key, 1)" icon>  
                <v-icon class="error--text">mdi-close-circle-outline</v-icon>           
              </v-btn>
            </v-chip>                    
          </form>
          <v-switch
            v-model="itemForUpdate.mark"
            color="green"
            label="Маркированный товар"
          ></v-switch>
          <v-select
            :items="measureNames"
            label="Единица измерения"
            v-model="itemForUpdate.measureName"
          ></v-select>
          <v-select
            :items="taxes"
            label="Налоговая ставка"
            v-model="itemForUpdate.tax"
          ></v-select>
          <v-btn class="success" @click="updateItem()">Изменить товар</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCreateFolder" min-width="80%" >
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
    </v-dialog>

    <v-dialog v-model="dialogUpdateFolder" min-width="80%" >
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
    </v-dialog>

    <!-- Список товаров и каталогов -->
    
    <v-card >
      <v-container>

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
          <v-col cols="1">
            Остаток
          </v-col>
          <v-col cols="2">
            Цена
          </v-col>
          <v-col cols="2">
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

          <v-col cols="8"  
            @click="$router.push({
              path: '/dashboard/items',
              query: {
                      folder: folder._id,
                  }
            })"
          >
            <v-icon class="mr-4">mdi-folder-open-outline</v-icon>   {{folder.title}}
          </v-col>

          <v-col cols="2" class="text-center">
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

          <v-col cols="1" class="text-center">
              {{item.quantity}}
          </v-col>
          
          <v-col cols="2" class="text-center">
              {{item.price}}
          </v-col>

          <v-col cols="2" class="text-center">
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
    
    <alert :alert="alert" :timeout="5000"/>
  </div>  
</template>

<script>
import { findFolderParent } from '../../store/dbAPI/items/findFolderParent'
import taxationTypes from '../resources/taxationTypes.js'
import measureNames from '../resources/measureNames.js'
import taxes from '../resources/taxes.js'

import Alert from '../alerts/alert'
    export default {
    name: 'items',  
    components: {
      Alert
    },
    data() {
      return {
        dialogCreateItem: false,
        dialogCreateFolder: false,
        dialogUpdateItem: false,
        dialogUpdateFolder: false,
        selectedItems: [],
        selectedFolders: [],
        barcode: "",
        barcodeForItemForUpdate: "",
        item:{
              title: '',
              price: null,
              costPrice: null,
              quantity: 0,
              barcodes:[],
              mark: false,
              measureName: 'шт',
              tax: 'none',
              parent: "root"
          },
          itemForUpdate: {
              title: '',
              price: null,
              costPrice: null,
              barcodes:[],
              quantity: 0,
              mark: false,
              measureName: 'шт',
              tax: 'none',
              parent: "root"
          },
          folder:{
              title: '',
              parent: "root",
              taxSystem: null
          },
          folderForUpdate:{
              title: '',
              parent: "root",
              taxSystem: null
          },
          taxationTypes: taxationTypes,
          measureNames: measureNames,
          taxes: taxes
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
      addBarcode() {
        this.item.barcodes.push(Number(this.barcode))
        this.barcode = ''
      }, 
      addBarcodeToItemForUpdate() {
        this.itemForUpdate.barcodes.push(Number(this.barcodeForItemForUpdate))
        this.barcodeForItemForUpdate = ''
      },      
      createItem() {
        this.item.parent = this.$route.query.folder
        this.$store.dispatch('items/createItem', this.item)
        // сброс формы товара      
        this.dialogCreateItem = false
        this.item ={
              title: '',
              price: null,
              costPrice: null,
              quantity: 0,
              barcodes:[],
              mark: false,
              measureName: 'шт',
              tax: 'none',
              parent: "root"
          }
      },
      updateItem() {
        console.log(this.itemForUpdate)
        this.$store.dispatch('items/updateItem', this.itemForUpdate)
        this.dialogUpdateItem = false
      },
      //удаляет и item и folder
      remove() {        
        if (this.selectedItems.length) {
          this.$store.dispatch('items/removeItems', this.selectedItems)
           this.selectedItems = []
        }
        if (this.selectedFolders.length) {
          this.$store.dispatch('items/removeFolders', this.selectedFolders)
          this.selectedFolders = []
        }    
      },
      createFolder() {
        // указываем родительский каталог для нового каталога
        this.folder.parent = this.$route.query.folder
        this.$store.dispatch('items/createFolder', this.folder)
        //сброс формы создания каталога
        this.dialogCreateFolder = false
        this.folder = {
            title: ''
        }
      },
      updateFolder() {
        this.$store.dispatch('items/updateFolder', this.folderForUpdate)
        this.dialogUpdateFolder = false
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
        
      }
    }
  }
</script>

<style>
  
</style>
