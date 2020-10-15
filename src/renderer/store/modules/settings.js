import { getSettingsFromBase } from '../dbAPI/settings/getSettings'
import { createSettingsInBase } from '../dbAPI/settings/createSettings'
import { updateSettingsInBase } from '../dbAPI/settings/updateSettings'

const state = {
  taxSystem: null,
  alert: {
    show: false,
    text: ''
  }
}

const mutations = {
  setSettings (state, settings) {
    state.taxSystem = settings.taxSystem
    state.operator = settings.operator
  }
}

const actions = {
  getSettings ({ commit }) {
    getSettingsFromBase().then(settings => {
      commit('setSettings', settings)
    });
  },  
  createSettings ({ commit, dispatch }, settings) {
    createSettingsInBase(settings).then(result => {
      dispatch('getSettings')
    });
  },
  updateSettings ({ commit }, parent) {
    updateSettingsInBase().then(settings => {
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
