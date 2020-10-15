const remote = require('electron').remote
const application = remote.app
var Datastore = require('nedb')
var dbFRSettings = new Datastore({ filename: `${application.getPath('userData')}/dbFRSettings.db`})
dbFRSettings.loadDatabase(function (err) { 
});
var dbMain = new Datastore({ filename: `${application.getPath('userData')}/dbMain.db`})
dbMain.loadDatabase(function (err) { 
});

import {getFiscalRegistersFromBase} from '../dbAPI/fiscalRegisters/getFiscalRegisters'
import {getCurrentFiscalRegisterFromBase} from '../dbAPI/fiscalRegisters/getCurrentFiscalRegisterFromBase'
import {setCurrentFiscalRegisterToBase} from '../dbAPI/fiscalRegisters/setCurrentFiscalRegisterToBase'
import {getCurrentFRSettings} from '../dbAPI/fiscalRegisters/getCurrentFRSettings'
import {addFiscalRegisterToBase} from '../dbAPI/fiscalRegisters/addFiscalRegister'
import {deleteFiscalRegisterFromBase} from '../dbAPI/fiscalRegisters/deleteFiscalRegister'

const state = {
  fiscalRegisters: [],
  currentFR: 0,
  currentFRSettings: {
    model: 'LIBFPTR_MODEL_ATOL_AUTO',  
    connection: 'LIBFPTR_PORT_COM',
    comFile: "COM1",
    baudRate: 'LIBFPTR_PORT_BR_115200', 
    IPAddress: "192.168.0.15", 
    IPPort: 5555,            
  },
}

const mutations = {
  SET_FISCAL_REGISTERS (state, payload) {
    state.fiscalRegisters = payload
  },
  SET_CURRENT_FR(state, payload) {
    console.log(payload)
    state.currentFR = payload
  },
  SET_CURRENT_FR_SETTINGS(state, payload) {
    console.log(payload)
    state.currentFRSettings = payload
  }
}

const actions = {
  getFiscalRegisters ({ commit }) {
    getFiscalRegistersFromBase(dbFRSettings).then(result => {
      console.log(result)
      commit('SET_FISCAL_REGISTERS', result)
    });
  },
  addFiscalRegister ({ commit, dispatch }, [ settings, serial ]) {
    addFiscalRegisterToBase(dbFRSettings, [ settings, serial ]).then(result => {
      dispatch('getFiscalRegisters')
    });
  },
  deleteFiscalRegister ({ commit, dispatch }, id) {
    deleteFiscalRegisterFromBase(dbFRSettings, id).then(result => {
      dispatch('getFiscalRegisters')
    });
  },
  saveCurrentFR({ commit }, fr) {
    console.log(fr)
    commit('SET_CURRENT_FR', fr)
  },
  getCurrentFR({ commit }) {
    getCurrentFiscalRegisterFromBase(dbMain).then(result => {
      commit('SET_CURRENT_FR', result)
    });
  },
  setCurrentFR({ commit }, id) {
    setCurrentFiscalRegisterToBase(dbMain, id).then(result => {
      commit('SET_CURRENT_FR', result)
    });
  },
  setCurrentFRSettings({ commit, state }) {
    getCurrentFRSettings(dbFRSettings, state.currentFR ).then(result => {
      commit('SET_CURRENT_FR_SETTINGS', result)
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
