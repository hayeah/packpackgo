import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '../views/Home'

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
})