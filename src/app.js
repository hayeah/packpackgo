import Vue from 'vue'
import router from './router'
import store from './store'
import App from './components/App'

const app = new Vue({
  router,
  store,
  ...App
})

export {
  router,
  store,
  app
}