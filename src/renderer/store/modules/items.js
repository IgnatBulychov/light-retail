import { getItemsFromBase } from '../dbAPI/items/getItems'
import { findFolderItems } from '../dbAPI/items/findFolderItems'
import { createItemInBase } from '../dbAPI/items/createItem'
import { removeItemsFromBase } from '../dbAPI/items/removeItems'

import { getFoldersFromBase } from '../dbAPI/items/getFolders'
import { findFolderParent } from '../dbAPI/items/findFolderParent'
import { findFolderChildren } from '../dbAPI/items/findFolderChildren'
import { createFolderInBase } from '../dbAPI/items/createFolder'
import { removeFoldersFromBase } from '../dbAPI/items/removeFolders'

const state = {
  items: [],
  folders: [],
  currentFolder: null,
  alert: {
    show: false,
    text: ''
  }
}

const getters = {
  /*
  getFoldersAndItems (state) {
    return state.folders.concat(state.items)
  }
  */
}

const mutations = {
  setItems (state, items) {
    state.items = items
  },
  setFolders (state, folders) {
    state.folders = folders
  },
  setAlert(state, alert) {
    state.alert = alert
  }
}

const actions = {
  getItems ({ commit }, parent) {
    getItemsFromBase(parent).then(items => {
      commit('setItems', items)
    });
  },  
  createItem ({ commit, dispatch }, item) {
    createItemInBase(item).then(result => {
      //узнаем родителя у нового товара и извлекаем товары этого каталога заново включая новичка
      dispatch('getItems', result.parent)
    });
  },
  removeItems ({ commit, dispatch }, items) {
    removeItemsFromBase(items).then(result => {
      //узнаем родителя у удаленного товара(первого попавшегося) и извлекаем товары этого каталога заново
      dispatch('getItems', items[0].parent)
    });
  },
  // ищет дочерние каталоги по ID родителя
  getFolders ({ commit }, parent) {
    getFoldersFromBase(parent).then(folders => {
      commit('setFolders', folders)
    });
  },  
  createFolder ({ commit, dispatch }, folder) {
    createFolderInBase(folder).then(result => {
      // запрашиваем снова дочерние папки для текущего каталога, т.к. еть новичек
      dispatch('getFolders', folder.parent)
      // нужно снова достать все каталоги, иначе кнопка назад не надет родителя
      dispatch('getAllFolders')
    });
  },
  removeFolders ({ state, dispatch, commit }, folders) {
    //let all = state.allFolders
    // перед тем как удалить надо отыскать и запомнить каталог в котором сейчас находимся)  
    let currentFolderID = null
    findFolderParent(folders[0]).then(parent => { 
      currentFolderID = parent
    })

    /*
    * "Рекурсиваня функция для поиска под каталогов"
    * Эта функция возвращает промис, т.к. при ее выолнениее нужо сделать несколько запросов в базу
    * Резолв срабатывает только когда у всех найденных папок не найдено  дочерних папок. 
    * Сама по себе функци ничего не возвращает, достаточно поймать резолв.
    * На вход фунции подается два аргумента (папки на удаление, папки для которых нужно найти дочерние папки)
    * Функция выполняет саму себя, передавая все более глубокие каталоги и конкатенируя результат в первый аргумент
    * 
    */
  
    let findChildrenFolders = function(result, folders) {
      return new Promise(function(resolve, reject){  
        let finder = function(result, folders) {
          findFolderChildren(folders).then(foundFolders => {
            if (!foundFolders.length) {
              //если нет дочерних элементов
              resolve(result)
              return 
            } else {
              //еще есть дочерние элементы, продолаем поиск
              let onlyIDofChildren = []
              foundFolders.forEach(folder => {
                onlyIDofChildren.push(folder._id)
              });
              finder(result.concat(onlyIDofChildren), onlyIDofChildren)
            }
          })
        }
        finder(result, folders)
      })
    }

    /*
    * вызываем саму функцию 
    * Промис возвращает все катлоги и подкаталоги
    * Далее ищем в каждой папке дочерние товары
    * и делаем запрос в базу на удаление 
    */
    findChildrenFolders(folders, folders).then(foldersToRemove => {
      findFolderItems(foldersToRemove).then(foundItems => {
        console.log(foundItems)
        let onlyID= []
        foundItems.forEach(item => {
            onlyID.push(item._id)
        });
        if (foundItems.length) {
          //если в каталогах есть товары, вначале удаляем их, а после успеха - сами каталоги
          removeItemsFromBase(onlyID).then(result => {
            removeFoldersFromBase(foldersToRemove).then(res => {
              dispatch('getFolders', currentFolderID)
            })
          })
        } else {
          //если в каталогах нет товаров, удаляем только каталоги
          removeFoldersFromBase(foldersToRemove).then(res => {
            dispatch('getFolders', currentFolderID)
          })
        }
        
      })
    }) 
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
