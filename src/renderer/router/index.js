import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/components/index').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/login').default
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/dashboard').default,
      children: [ 
                  {
                    path: 'landing',
                    name: 'landing',
                    component: require('@/components/landing').default
                  },
                  {
                    path: 'registration',
                    name: 'registration',
                    component: require('@/components/registration/registration').default
                  },
                  {
                    path: 'settings',
                    name: 'settings',
                    component: require('@/components/settings').default
                  },
                  {
                    path: 'reports',
                    name: 'reports',
                    component: require('@/components/reports/reports').default
                  },
                  {
                    path: 'items',
                    name: 'items',
                    component: require('@/components/items/items').default
                  },
                  {
                    path: 'customers',
                    name: 'customers',
                    component: require('@/components/customers/customers').default
                  },
                  {
                    path: 'suppliers',
                    name: 'suppliers',
                    component: require('@/components/suppliers/suppliers').default
                  }
                 
                ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
