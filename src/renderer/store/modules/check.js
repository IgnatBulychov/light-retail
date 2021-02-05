import { getItemFromBaseByCode } from '../dbAPI/items/getItemByCode'
import { getItemFromBaseByBarcode } from '../dbAPI/items/getItemByBarcode'

const state = {
  items: [],
  activeItem: null,
  checkSettings: {
    type: 'sell',
    taxationType: null
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
  setPaymentMethod(state, [ item, paymentMethod ]) {
    state.items[item].paymentMethod = paymentMethod
  },
  setCheckType(state, checkType) {
    state.checkSettings.checkType = checkType
  },
  setTaxationType(state, taxationType) {
    state.checkSettings.taxationType = taxationType
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
    activeItem = null
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
  getItemByBarcode({ commit, state }, barcode) {
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

          // если это первый товар добавленный в чек устанавливаем СНО для всего чека
          if (state.items.length == 0) {
            commit('setTaxationType', item.taxationType)
          } else if (item.taxationType != state.checkSettings.taxationType) {
            // если это не первый товар, узнаем нет ли конфликта СНО
            commit('setAlert', {
              show: true,
              type: "error",
              timeout: 5000,
              text: 'В чек нельзя добавлять товары с разными СНО'
            })
            return;
          }

          // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
          if (item.mark) {
            resolve(item)
          } else {
            // если товара нет в чеке назначаем ему количество равное одному
            item.quantity = 1;
            item.paymentMethod = 'fullPayment'
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

          // если это первый товар добавленный в чек устанавливаем СНО для всего чека
          if (state.items.length == 0) {
            commit('setTaxationType', item.taxationType)
          } else if (item.taxationType != state.checkSettings.taxationType) {
            // если это не первый товар, узнаем нет ли конфликта СНО
            commit('setAlert', {
              show: true,
              type: "error",
              timeout: 5000,
              text: 'В чек нельзя добавлять товары с разными СНО'
            })
            return;
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
  },
  getItemByBarcodeWithoutScan({ commit, state }, code) {

  },
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
