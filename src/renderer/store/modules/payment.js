
const state = {
  cashInputFocus: false,
}

const getters = { 
  cashInputFocus(state) {
    return state.cashInputFocus
  }
}

const mutations = {
  cashInputFocus(state) {
    state.cashInputFocus = state.cashInputFocus ? false : true
  },
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
