const state = {
  projects: [],
  activeIndex: -1,
  isBuilding: false
}

const mutations = {
  ADD_PROJECT(state, project) {
    state.projects.push(project)
  },
  START_BUILDING(state) {
    state.isBuilding = true
  },
  STOP_BUILDING(state) {
    state.isBuilding = false
  },
  SET_ACTIVE_PROJECT_INDEX(state, index) {
    state.activeIndex = index
  }
}

const actions = {
  addProject({commit}, {
    file,
    entry = 'index.js'
  }) {
    const project = {
      file,
      entry
    }
    commit('ADD_PROJECT', project)
    commit('SET_ACTIVE_PROJECT_INDEX', state.activeIndex + 1)
  },
  startBuilding({commit}) {
    commit('START_BUILDING')
  },
  stopBuilding({commit}) {
    commit('STOP_BUILDING')
  }
}

const getters = {
  activeProject(state) {
    return state.projects[state.activeIndex]
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}