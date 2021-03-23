import { getSettingsFromBase } from '../dbAPI/settings/getSettings'
import { createSettingsInBase } from '../dbAPI/settings/createSettings'
import { saveMainSettingsInBase } from '../dbAPI/settings/saveMainSettings'

const state = {
  mainSettings: {
    taxationTypeDefault: null,
    paymentTypesDefault: []
  },
  currentFiscalPrinter: null,
  alert: {
    show: false,
    text: ''
  }
}

const mutations = {
  setSettings (state, settings) {
    state.mainSettings.taxationTypeDefault = settings.taxationTypeDefault
    state.mainSettings.paymentTypesDefault = settings.paymentTypesDefault
  }
}

const actions = {
  getSettings ({ commit, dispatch }) {
    getSettingsFromBase().then(settings => {
      if (settings) {
        commit('setSettings', settings)
      } else {
        dispatch('createSettings')
      }      
    });
  },  
  createSettings ({ commit, dispatch }) {
    createSettingsInBase().then(result => {
      dispatch('getSettings')
    });
  },
  saveMainSettings ({ commit, dispatch }, settings) {
    saveMainSettingsInBase(settings).then(settings => {
      dispatch('getSettings')
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
