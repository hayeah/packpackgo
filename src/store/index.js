import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import app from './modules/app'
import project from './modules/project'

const store = new Vuex.Store({
  modules: {
    app,
    project
  }
})

window.store = store
export default store