import { getEquipmentFromBase } from '../dbAPI/equipment/getEquipment'
import { createEquipmentItemInBase } from '../dbAPI/equipment/createEquipmentItem'
import { removeEquipmentItemFromBase } from '../dbAPI/equipment/removeEquipmentItem'

const state = {
  equipment: []
}

const mutations = {
  setEquipment (state, equipment) {
    state.equipment = equipment
  }
}

const getters = {
  currentScanner (state) { 
    let scanners = []   
    state.equipment.forEach(element => {
      
      if (element.type == 'Сканер') {
        scanners.push(element)
      }
    });
    return scanners.find(equipment => equipment.active == true)
  },
  currentFiscalPrinter (state) { 
    let fiscalPrinters = []   
    state.equipment.forEach(element => {
      
      if (element.type == 'Фискальный регистратор') {
        fiscalPrinters.push(element)
      }
    });
    return fiscalPrinters.find(equipment => equipment.active == true)
  }
}

const actions = {
  getEquipment ({ commit }) {
    getEquipmentFromBase().then(equipment => {
      commit('setEquipment', equipment)
    });
  },
  createEquipmentItem ({ commit, dispatch }, equipment) {
    createEquipmentItemInBase(equipment).then(equipment => {
      dispatch('getEquipment')
    });
  },
  removeEquipmentItem ({ commit, dispatch }, id) {
    removeEquipmentItemFromBase(id).then(id => {
      dispatch('getEquipment')
    });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
