import { getSettingsFromBase } from '../dbAPI/settings/getSettings'

const state = {
  items: [],
  activeItem: null,
  taxationTypeDefault: '',
  checkSettings: {
    checkType: 'sell',
    taxationType: '',    
    customer: false,
  },
  alert: {
    show: false,
    type: "success",
    timeout: 1000,
    text: ''
  }
}

const mutations = {
  addItemToCheck (state, item) {
    state.items.unshift(item);
    state.activeItem = 0
  },
  removeItem(state, item) {    
    state.items.splice(item, 1)      
    state.activeItem = 0         
  },
  setQuantity(state, [ item, quantity ]) {
    if (quantity == "") {
      return
    }
    state.items[item].quantity = quantity
  },
  setCheckType(state, checkType) {
    state.checkSettings.checkType = checkType
  },
  setActiveItem(state, activeItem) {
    state.activeItem = activeItem
  },
  setTaxationType(state, taxationType) {
    state.checkSettings.taxationType = taxationType
    state.taxationTypeDefault = taxationType
  },
  setCustomer(state, customer) {
    state.checkSettings.customer = customer
  },
  quantityPlusFloat(state, [ item, quantity ]) {
    state.items[item].quantity = Number(state.items[item].quantity) + Number(quantity);
    let temp = state.items[item]
    state.items.splice(item, 1)  
    state.items.unshift(temp)  
    state.activeItem = 0  
       
  },
  quantityPlusOne(state, item) {
    state.items[item].quantity++;
    state.activeItem = item
  },  
  quantityMinusOne(state, item) {
    if (state.items[item].quantity == 1) {
      return
    }
    state.items[item].quantity--;
    state.activeItem = item
  },
  clearCheck(state) {
    state.items = [];
    state.activeItem = null;
    state.checkSettings = {
      checkType: 'sell',
      taxationType: state.taxationTypeDefault,    
      customer: false,
    }
  },
  changePosition(state, direction) {
    console.log(state.activeItem)
    if (direction == "up") {
      if (state.activeItem == 0) {
        state.activeItem = state.items.length-1
      } else {
        state.activeItem--      
      }      
    } else if (direction == "down") {
      if (state.activeItem == state.items.length-1) {
        state.activeItem = 0
      } else {
        state.activeItem++
      }
    }
  },
  setAlert(state, alert) {
    state.alert = alert
  }
}

const actions = {
  addItemtoCheck({ commit, state }, item) {
    // проверяем есть ли в чеке такой же товар
    let copy = state.items.find(itemInCheck => itemInCheck._id == item._id)
    console.log(item, copy)
    if (copy) { 
      if (item.mark) {
        commit('addItemToCheck', item)
        commit('itemAdditionManager/init', null, { root: true })
        setTimeout(function() {
          commit('itemAdditionManager/barcodeInputFocus', null, { root: true })
        }, 1)        
      } else {
        //найдем индекс этого товара и отправим его в коммит добавления количества
        commit('quantityPlusFloat', [ state.items.indexOf(copy), item.quantity ])  
        commit('itemAdditionManager/init', null, { root: true })
        setTimeout(function() {
          commit('itemAdditionManager/barcodeInputFocus', null, { root: true })
        }, 1)
      }
    } else {
      commit('addItemToCheck', item)
      commit('itemAdditionManager/init', null, { root: true })
      setTimeout(function() {
        commit('itemAdditionManager/barcodeInputFocus', null, { root: true })
      }, 1)
    }
  },
  getCheckSettings({ commit, state }) {
    getSettingsFromBase().then(settings => { 
      commit('setTaxationType', settings.taxationTypeDefault)
    })
  },
/*  getItemByBarcode({ commit, state }, barcode) {
    return new Promise((resolve, reject) => {
      
      // проверяем есть ли в чеке такой же товар
      if (state.items.find(item => item.barcodes.includes(Number(barcode)))) {
        // если есть ищем его 
        let item = state.items.find(item => item.barcodes.includes(Number(barcode)))
        // и увеличиваем его количество на 1 если товар не маркированный
        // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
        if (item.mark) {
          //клонируем объект для создания независимой копии
          let clone = {}
          Object.assign(clone, item)
          
          resolve(clone)
        } else {
          //найдем индекс этого товара и отправим его в коммит
          commit('quantityPlusOne', state.items.indexOf(item))                      
        }
      } else {  
        getItemFromBaseByBarcode(barcode).then(item => {

          // если товар не существует
          if (!item) {
            commit('setAlert',{
              show: true,
              type: "error",
              timeout: 2000,
              text: 'Ничего не найдено'
            })
            return
          }

          // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
          if (item.mark) {
            resolve(item)
          } else {
            // если товара нет в чеке назначаем ему количество равное одному
            item.quantity = 1;
            // и добавляем в чек            
            commit('addItemToCheck', item)
          } 
        });
      }
    })
  },
  getItemByCode({ commit, state }, code) {
    return new Promise((resolve, reject) => {

      // проверяем есть ли в чеке такой же товар
      if (state.items.find(item => item.code == code)) {
        // если есть ищем его 
        let item = state.items.find(item => item.code == code)
        // и увеличиваем его количество на 1 если товар не маркированный
        // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
        if (item.mark) {
          //клонируем объект для создания независимой копии
          let clone = {}
          Object.assign(clone, item)
          
          resolve(clone)
        } else {
          //найдем индекс этого товара и отправим его в коммит
          commit('quantityPlusOne', state.items.indexOf(item))                      
        }  
        
      } else { 
        getItemFromBaseByCode(code).then(item => {          
          
          // если товар не существует
          if (!item) {
            commit('setAlert',{
              show: true,
              type: "error",
              timeout: 2000,
              text: 'Ничего не найдено'
            })
            return
          }


          if (item.mark) {
            resolve(item)
          } else {
            // если товара нет в чеке назначаем ему количество равное одному
            item.quantity = 1;
            // и добавляем в state, в чек
            commit('addItemToCheck', item)
          } 
        });
      }

    })
  },*/
  setQuantity({ commit }, [ item, quantity ]) {
    commit('setQuantity', [ item, quantity ] )
  },
  removeItem({ commit }, item) {
    commit('removeItem', item)
  },
  changeQuantity({ commit }, [ item, changing ] ) {
    if (changing) {
      commit('quantityPlusOne', item)
    } else {
      commit('quantityMinusOne', item)
    }        
  },
  changePosition({ commit }, direction ) {    
    commit('changePosition', direction)            
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
