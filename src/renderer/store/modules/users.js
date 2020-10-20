import { getUsersFromBase } from '../dbAPI/users/getUsers'
import { createUserInBase } from '../dbAPI/users/createUser'
import { updateUserInBase } from '../dbAPI/users/updateUser'
import { removeUserFromBase } from '../dbAPI/users/removeUser'

const state = {
  users: [],
  currentUser: null,
}

const mutations = {
  setUsers (state, users) {
    state.users = users
  },
  setCurrentUser (state, user) {
    state.currentUser = user
  },
  reset(state) {
    state.users = []
    state.currentUser = null
  },
  setAlert(state, alert) {
    state.alert = alert
  }
}

const actions = {
  getUsers ({ commit }) {
    return new Promise((resolve, reject) => {
      getUsersFromBase().then(users => {        
        commit('setUsers', users)
        resolve()
      });
    })
  },  
  createUser ({ dispatch }, user) {
    createUserInBase(user).then(result => {
      dispatch('getUsers')
    });
  },
  removeUser ({ dispatch }, user) {
    removeUserFromBase(user).then(result => {
      dispatch('getUsers')
    });
  },
  updateUser ({ dispatch }, user) {
    console.log(user)
    updateUserInBase(user).then(user => {
      dispatch('getUsers')
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
