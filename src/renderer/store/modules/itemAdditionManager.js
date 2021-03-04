// этот модуль ищет позицию в базе, и устанавливает для нее первоначальные настройки перед добавлением в чек


const state = {
  barcodeInputFocus: false,
  item: null,
  liveStep: "init"
}

const getters = { 
  barcodeInputFocus(state) {
    return state.barcodeInputFocus
  },
  getLiveStep(state) {
    return state.liveStep
  },
}

const mutations = {
  // при входе в режим регистрации или при закртии какого либо диалогового окна производиться мутация,
  // ее отслеживает комонент ItemFinder и фокусирует курсор на input для штрих кода
  init(state) {
    state.barcodeInputFocus = state.barcodeInputFocus ? false : true
    state.item = null
    state.liveStep = "init"
    console.log('AdditionManagerInit')
  },
  barcodeInputFocus(state) {
    state.barcodeInputFocus = state.barcodeInputFocus ? false : true
  },
  setLiveStep(state, liveStep) {
    state.liveStep = liveStep
  },
  setItem(state, item) {
    state.item = item
    state.liveStep = 'created'
    
    console.log(state.liveStep, item)
  },
  setQuantity(state, quantity) {
    state.item.quantity = quantity
    state.liveStep = 'quantitySetting'
    console.log(state.liveStep)
  },
  setNomenclatureCode(state, [ gtin, serial, nomenclatureCode, raw ]) {
    state.item.gtin = gtin
    state.item.serial = serial
    state.item.nomenclatureCode = nomenclatureCode
    state.item.rawDatamatrix = raw
    console.log('end Item')
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
