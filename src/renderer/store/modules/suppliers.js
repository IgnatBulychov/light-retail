import { getSuppliersFromBase } from '../dbAPI/suppliers/getSuppliers'
import { createSupplierInBase } from '../dbAPI/suppliers/createSupplier'
import { updateSupplierInBase } from '../dbAPI/suppliers/updateSupplier'
import { removeSupplierFromBase } from '../dbAPI/suppliers/removeSupplier'

const state = {
  suppliers: []
}

const mutations = {
  setSuppliers (state, suppliers) {
    state.suppliers = suppliers
  }
}

const actions = {
  getSuppliers ({ commit }) {
    getSuppliersFromBase().then(suppliers => {        
      commit('setSuppliers', suppliers)
    });
  },  
  createSupplier ({ dispatch }, supplier) {
    createSupplierInBase(supplier).then(result => {
      dispatch('getSuppliers')
    });
  },
  updateSupplier ({ dispatch }, supplier) {
    updateSupplierInBase(supplier).then(result => {
      dispatch('getSuppliers')
    });
  },
  removeSupplier ({ dispatch }, supplier) {
    removeSupplierFromBase(supplier).then(result => {
      dispatch('getSuppliers')
    });
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
