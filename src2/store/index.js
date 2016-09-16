import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as getters from './getters'
import * as actions from './actions'
import app from './modules/app'
import project from './modules/project'

const plugins = []

if (__DEV__) {
  plugins.push(
    require('vuex/logger')()
  )
}

const store = new Vuex.Store({
  modules: {
    app,
    project
  },
  actions,
  getters,
  plugins
})

if (__DEV__) {
  window.store = store
}
export default store
