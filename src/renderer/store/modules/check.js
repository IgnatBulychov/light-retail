import { getItemFromBaseByCode } from '../dbAPI/items/getItemByCode'
import { getItemFromBaseByBarcode } from '../dbAPI/items/getItemByBarcode'

const state = {
  items: [],
  activeItem: null,
  alert: {
    show: false,
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
  getItem ({ commit, state }, inputCode) {
    //проверка введеного кода на тип
    //
    return new Promise((resolve, reject) => {
      if (inputCode.length == 13) {
        //если это штрихкод
        // проверяем есть ли в чеке такой же товар
        if (state.items.find(item => item.barcode == inputCode)) {
          // если есть ищем его 
          let item = state.items.find(item => item.barcode == inputCode)
          // и увеличиваем его количество на 1 если товар не маркированный
          // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
          if (item.mark) {
            //клонируем объект для создания независимой копии
            let clone = {}; for (let key in item) {
              clone[key] = item[key];
            }
            console.log('??',clone)
            resolve(clone)
          } else {
            commit('quantityPlusOne', item)
          }  
        } else {  
          getItemFromBaseByBarcode(inputCode).then(item => {
            // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
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
      } else if (inputCode.length < 7) {
        
        // если это внутренний код
        // проверяем есть ли в чеке такой же товар
        if (state.items.find(item => item.code == inputCode)) {
          // если есть ищем его 
          let item = state.items.find(item => item.code == inputCode)
          // и увеличиваем его количество на 1 если товар не маркированный
          // если маркированый ждем коммит от компонента регистрации, если успешно отсканирован код
          if (item.mark) {
            //клонируем объект для создания независимой копии
            let clone = {}; 
            for (let key in item) {
              clone[key] = item[key];
            }
            console.log('??',clone)
            resolve(clone)
          } else {
            // и увеличиваем его количество на 1
            commit('quantityPlusOne', item)
          }  
          
        } else { 
          getItemFromBaseByCode(inputCode).then(item => {
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
      } else if (inputCode.length > 14) {
        // если это код маркировки
        if (inputCode.length == 29) {
          //пункт 7 инструкции ЧЗ
        } else {
          
          //пункт 6 инструкции ЧЗ
        }

      }    
    })
    
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
