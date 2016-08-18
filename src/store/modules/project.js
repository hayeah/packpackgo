const state = {
  projects: [],
  activeIndex: -1
}

const mutations = {
  ADD_PROJECT(state, project) {
    state.projects.push(project)
  }
}

export default {
  state,
  mutations
}