import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/dpl-machine',
    name: 'DPLMachine',
    component: () => import('../views/DPLMachine.vue'),
    meta: { requiresAuth: true, role: 'machine' }
  },
  {
    path: '/dpl-tos',
    name: 'DPLTOS',
    component: () => import('../views/DPLTOS.vue'),
    meta: { requiresAuth: true, role: 'tos' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAuth && to.meta.role && userRole !== to.meta.role) {
    next('/')
  } else {
    next()
  }
})

export default router
