import Vue from 'vue';
import VueRouter from 'vue-router';
import router from './router/index';
import Element from 'element-ui';
import App from './App.vue';

import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Element);
Vue.use(VueRouter);

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app');
