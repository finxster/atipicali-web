import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PlacePage from '../pages/PlacePage.vue'
import AddPlace from '../pages/AddPlace.vue'
import PlaceSubmitted from '../pages/PlaceSubmitted.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import NewsPage from '../pages/NewsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/place/:id',
    name: 'PlacePage',
    component: PlacePage
  },
  {
    path: '/add-place',
    name: 'AddPlace',
    component: AddPlace
  },
  {
    path: '/place-submitted/:id',
    name: 'PlaceSubmitted',
    component: PlaceSubmitted
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/news',
    name: 'NewsPage',
    component: NewsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard: protect routes that require authentication
router.beforeEach((to, from, next) => {
  // For now use the persisted token in localStorage as the auth signal
  const token = localStorage.getItem('atipicali_token')
  const requiresAuth = to.name === 'AddPlace'
  if (requiresAuth && !token) {
    // redirect to login and keep the intended route in the query
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
