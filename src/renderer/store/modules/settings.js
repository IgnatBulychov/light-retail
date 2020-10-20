import { getSettingsFromBase } from '../dbAPI/settings/getSettings'
import { createSettingsInBase } from '../dbAPI/settings/createSettings'
import { updateSettingsInBase } from '../dbAPI/settings/updateSettings'

const state = {
  taxationTypeDefault: null,
  selectedFR: null,
  alert: {
    show: false,
    text: ''
  }
}

const mutations = {
  setSettings (state, settings) {
    state.taxationTypeDefault = settings.taxationTypeDefault
    state.selectedFR = selectedFR
  },
  setTaxationTypeDefault (state, taxationTypeDefault) {
    state.taxationTypeDefault = taxationTypeDefault
  },
  setSelectedFR (state, selectedFR) {
    state.selectedFR = selectedFR
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
  updateSettings ({ commit, dispatch }, settings) {
    updateSettingsInBase(settings).then(settings => {
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
