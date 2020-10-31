import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import titleMixin from './mixins/titleMixin'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.mixin(titleMixin);

new Vue({
  router,
  store,
  beforeCreate() { this.$store.commit("initStore")},
  vuetify,
  render: h => h(App)
}).$mount('#app')
