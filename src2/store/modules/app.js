const state = {
  foo: 'bar',
  consoleLogs: []
}

const mutations = {
  UPDATE_CONSOLE(state, log) {
    state.consoleLogs.push(log)
  }
}

const actions = {
  updateConsole({commit}, log) {
    commit('UPDATE_CONSOLE', log)
  }
}

const getters = {
  consoleLogs: state => state.consoleLogs
}

export default {
  state,
  mutations,
  actions,
  getters
}