import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode:"history",
  routes: [
    {
      path: '/login',
      name:"login",
      meta: {
        title: '登陆'
      },
      component: resolve => require(['@/view/login/index.vue'], resolve),
    },
    {
      path: '/',
      component: resolve => require(['@/view/index/home.vue'], resolve),
      children:[
        {
          path: '/',
          name:"index",
          meta: {
            title: '首页'
          },
          component: resolve => require(['@/view/index/index.vue'], resolve),
        }
      ]
    },
    {
      path: '*',
      meta: {
        title: '404'
      },
      component: resolve => require(['@/view/404/index.vue'], resolve),
    }
  ]
})

export default router;