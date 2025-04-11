import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
// import Start from '../views/StartView/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('../views/HomeView/index.vue'),
    // },
    // {
    //   path: '/',
    //   name: 'start',
    //   component: () => import('../views/StartView/index.vue'),
    // },
    // {
    //   path: '/',
    //   name: 'invite',
    //   component: () => import('../views/invite/index.vue'),
    //   // component: Start,
    // },
    {
      path: '/inviteAdmin',
      name: 'inviteAdmin',
      component: () => import('../views/inviteAdmin/indexNew.vue'),
      // component: Start,
    },
    {
      path: '/bindingInviter',
      name: 'bindingInviter',
      component: () => import('../views/bindingInviter/index.vue'),
    },
    // {
    //   path: '/',
    //   name: 'captcha',
    //   component: () => import('../views/captcha/index.vue'),
    // },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: () => import('../views/profile/profile.vue'),
    // },
    // {
    //   path: '/application/materials',
    //   name: 'ApplicationMaterials',
    //   component: () => import('../views/application/materials.vue'),
    // },
    // {
    //   path: '/application/detail',
    //   name: 'ApplicationDetails',
    //   component: () => import('../views/application/details.vue'),
    // },
    // {
    //   path: '/agent/search',
    //   name: 'AgentSearch',
    //   component: () => import('../views/agent/SearchView.vue'),
    // },
    // {
    //   path: '/agent/review',
    //   name: 'AgentReview',
    //   component: () => import('../views/agent/ReviewView.vue'),
    // },
    // {
    //   path: '/agent/deposit',
    //   name: 'AgentDeposit',
    //   component: () => import('../views/agent/DepositView.vue'),
    // },
    // {
    //   path: '/management/orders',
    //   name: 'ManagementOrders',
    //   component: () => import('../views/management/OrdersView.vue'),
    // },
    // {
    //   path: '/management/information',
    //   name: 'ManagementInformation',
    //   component: () => import('../views/management/InformationView.vue'),
    // },
    // {
    //   path: '/lang-demo',
    //   name: 'langDemo',
    //   component: () => import('../views/LangDemoView.vue'),
    // },
    // {
    //   path: '/commission/settings',
    //   name: 'CommissionSettings',
    //   component: () => import('../views/Commission/Settings.vue'),
    // },
    // {
    //   path: '/commission/details',
    //   name: 'CommissionDetails',
    //   component: () => import('../views/Commission/Details.vue'),
    // },
    // {
    //   path: '/user/search',
    //   name: 'UserSearch',
    //   component: () => import('../views/user/search.vue'),
    // },
  ],
})

export default router
