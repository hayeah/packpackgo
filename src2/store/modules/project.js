const state = {
  projects: [],
  activeIndex: -1
}

const mutations = {
  ADD_PROJECT(state, project) {
    const stored = state.projects.some(p => {
      return p.path === project.path
    })
    if (!stored) {
      state.projects.unshift(project)
    }
  }
}

export default {
  state,
  mutations
}
