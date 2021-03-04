import { getAgencySchemesFromBase } from '../dbAPI/agencySchemes/getAgencySchemes'
import { createAgencySchemeInBase } from '../dbAPI/agencySchemes/createAgencyScheme'
import { updateAgencySchemeInBase } from '../dbAPI/agencySchemes/updateAgencyScheme'
import { removeAgencySchemeFromBase } from '../dbAPI/agencySchemes/removeAgencyScheme'

const state = {
  agencySchemes: []
}

const mutations = {
  setAgencySchemes (state, agencySchemes) {
    state.agencySchemes = agencySchemes
  }
}

const actions = {
  getAgencySchemes ({ commit }) {
    getAgencySchemesFromBase().then(agencySchemes => {        
      commit('setAgencySchemes', agencySchemes)
    });
  },  
  createAgencyScheme ({ dispatch }, agencyScheme) {
    createAgencySchemeInBase(agencyScheme).then(result => {
      dispatch('getAgencySchemes')
    });
  },
  updateAgencyScheme ({ dispatch }, agencyScheme) {
    updateAgencySchemeInBase(agencyScheme).then(result => {
      dispatch('getAgencySchemes')
    });
  },
  removeAgencyScheme ({ dispatch }, agencyScheme) {
    removeAgencySchemeFromBase(agencyScheme).then(result => {
      dispatch('getAgencySchemes')
    });
  } 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
