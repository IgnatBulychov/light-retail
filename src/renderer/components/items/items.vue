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
        <v-card-text>
          <v-container>
              <v-row>
                <v-col cols="12">
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
                  <v-text-field
                      v-model="item.barcode"
                      label="Штрихкод"
                  ></v-text-field>
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
                </v-col>
              </v-row>
          </v-container>
          <v-btn class="success" @click="createItem()">Создать товар</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCreateFolder" min-width="80%" >
      <v-card>
        <v-card-text>
          <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      v-model="folder.title"
                      label="Наименование"
                  ></v-text-field>
                  
                  <v-select
                    :items="taxSystems"
                    label="СНО товаров или услуг каталога"
                    v-model="folder.SNO"
                  ></v-select>
                </v-col>
              </v-row>
          </v-container>
          <v-btn class="success" @click="createFolder()">Создать каталог</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Список товаров и каталогов -->
    
    <v-card >
      <v-container>

        <!-- кнопка "назад", в прошлый каталог -->

        <v-row v-if="$route.query.folder != 'root'">
          <v-col cols="12" 
            @click="back()"
          >...</v-col>
        </v-row>

        <!-- папки -->
<div  v-if="folders.length || items.length"> 
        <v-row v-for="folder in folders" :key="folder._id">
          <v-col cols="1">
            <v-checkbox hide-details class="shrink mx-0 my-0"  v-model="selectedFolders" :value="folder._id"></v-checkbox>
          </v-col>
      
          <v-col cols="11"  
            @click="$router.push({
              path: '/dashboard/items',
              query: {
                      folder: folder._id,
                  }
            })"
          >
            <v-icon class="mr-4">mdi-folder-open-outline</v-icon>   {{folder.title}} -  {{folder._id}}
          </v-col>
        </v-row>

        <!-- товары -->

        <v-row v-for="item in items" :key="item._id">
          <v-col cols="1">
            <v-checkbox hide-details class="shrink mx-0 my-0" v-model="selectedItems" :value="item._id"></v-checkbox>
          </v-col>     

          <v-col cols="1">
            {{ item.code }}
          </v-col>            
            
          <v-col cols="10">
              <v-icon class="mr-4">mdi-package-variant-closed</v-icon>  {{item.title}}
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
        selectedItems: [],
        selectedFolders: [],
        item:{
              title: '',
              price: null,
              costPrice: null,
              barcode: null,
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
          taxSystems: [
            {
              text: 'Общая',
              value: 'osn'
            },
            {
              text: 'УСН Доход',
              value: 'usnIncome'
            },
            {
              text: 'УСН Доход минус Расход',
              value: 'usnIncomeOutcome'
            },
            {
              text: 'ЕНВД',
              value: 'envd'
            },
            {
              text: 'Единый сельскохозяйственный налог',
              value: 'esn'
            },
            {
              text: 'Патент',
              value: 'patent'
            }            
          ],
          measureNames: [
            {
              text: 'шт',
              value: 'шт'
            },
            {
              text: 'кг',
              value: 'кг'
            }
          ],
          taxes: [
            {
              text: 'Без НДС',
              value: 'none'
            },
            {
              text: 'НДС 0%',
              value: 'vat0'
            },
            {
              text: 'НДС 10%',
              value: 'vat10'
            },
            {
              text: 'НДС 20%',
              value: 'vat20'
            },
            {
              text: 'НДС 10/110',
              value: 'vat110'
            },
            {
              text: 'НДС 20/120',
              value: 'vat120'
            },
          ]
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
      createItem() {
        this.item.barcode = Number(this.item.barcode)
        this.item.parent = this.$route.query.folder
        this.$store.dispatch('items/createItem', this.item)
        // сброс формы товара      
        this.dialogCreateItem = false
        this.item = {
            title: '',
            price: null,
            barcode: null
        }
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
