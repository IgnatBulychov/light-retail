import { getFiscalPrintersFromBase } from '../dbAPI/fiscalPrinters/getFiscalPrinters'
import { createFiscalPrinterInBase} from '../dbAPI/fiscalPrinters/createFiscalPrinter'
import { updateFiscalPrinterInBase} from '../dbAPI/fiscalPrinters/updateFiscalPrinter'
import { removeFiscalPrinterFromBase } from '../dbAPI/fiscalPrinters/removeFiscalPrinter'

const state = {
  fiscalPrinters: []
}

const mutations = {
  setFiscalPrinters (state, fiscalPrinters) {
    state.fiscalPrinters = fiscalPrinters
  }
}

const getters = {
  currentFiscalPrinter (state) {    
    return state.fiscalPrinters.find(fiscalPrinter => fiscalPrinter.active == true)
  }
}

const actions = {
  getFiscalPrinters ({ commit }) {
    getFiscalPrintersFromBase().then(fiscalPrinters => {
      commit('setFiscalPrinters', fiscalPrinters)
    });
  },
  createFiscalPrinter ({ commit, dispatch }, fiscalPrinter) {
    createFiscalPrinterInBase(fiscalPrinter).then(fiscalPrinter => {
      dispatch('getFiscalPrinters')
    });
  },
  updateFiscalPrinter ({ commit, dispatch }, fiscalPrinter) {
    updateFiscalPrinterInBase(fiscalPrinter).then(fiscalPrinter => {
      dispatch('getFiscalPrinters')
    }); 
  },
  removeFiscalPrinter ({ commit, dispatch }, id) {
    removeFiscalPrinterFromBase(id).then(fiscalPrinter => {
      dispatch('getFiscalPrinters')
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
