import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './vuex/store'
import ElementUI from 'element-ui';
import * as api from '@/api/index'

import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.prototype.api = api

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App),
    el: '#app'
})