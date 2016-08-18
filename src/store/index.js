import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import * as getters from './getters'
import * as actions from './actions'
import app from './modules/app'
import project from './modules/project'

const store = new Vuex.Store({
  modules: {
    app,
    project
  },
  actions,
  getters
})

if (__DEV__) {
  window.store = store
}
export default store