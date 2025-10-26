import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PlacePage from '../pages/PlacePage.vue'
import AddPlace from '../pages/AddPlace.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

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
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
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

export default router
