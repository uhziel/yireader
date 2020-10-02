import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import titleMixin from './mixins/titleMixin'

Vue.config.productionTip = false

Vue.mixin(titleMixin);

new Vue({
  router,
  store,
  beforeCreate() { this.$store.commit("initStore")},
  render: h => h(App)
}).$mount('#app')
