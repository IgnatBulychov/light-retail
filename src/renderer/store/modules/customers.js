import { getCustomersFromBase } from '../dbAPI/customers/getCustomers'
import { createCustomerInBase } from '../dbAPI/customers/createCustomer'
import { updateCustomerInBase } from '../dbAPI/customers/updateCustomer'
import { removeCustomerFromBase } from '../dbAPI/customers/removeCustomer'

const state = {
  customers: []
}

const mutations = {
  setCustomers (state, customers) {
    state.customers = customers
  }
}

const actions = {
  getCustomers ({ commit }) {
    getCustomersFromBase().then(customers => {        
      commit('setCustomers', customers)
    });
  },  
  createCustomer ({ dispatch }, customer) {
    createCustomerInBase(customer).then(result => {
      dispatch('getCustomers')
    });
  },
  updateCustomer ({ dispatch }, customer) {
    updateCustomerInBase(customer).then(result => {
      dispatch('getCustomers')
    });
  },
  removeUser ({ dispatch }, customer) {
    removeCustomerFromBase(customer).then(result => {
      dispatch('getCustomers')
    });
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
