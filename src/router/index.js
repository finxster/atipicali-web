import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PlacePage from '../pages/PlacePage.vue'
import AddPlace from '../pages/AddPlace.vue'
import PlaceSubmitted from '../pages/PlaceSubmitted.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import AuthRequired from '../pages/AuthRequired.vue'
import VerifyEmail from '../pages/VerifyEmail.vue'
import VerifyEmailToken from '../pages/VerifyEmailToken.vue'
import NewsPage from '../pages/NewsPage.vue'
import SearchResults from '../pages/SearchResults.vue'
import About from '../pages/About.vue'
import Contact from '../pages/Contact.vue'
import PrivacyPolicy from '../pages/PrivacyPolicy.vue'
import TermsOfUse from '../pages/TermsOfUse.vue'

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
    path: '/auth-required',
    name: 'AuthRequired',
    component: AuthRequired
  },
  {
    path: '/verify-email',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/verify',
    name: 'VerifyEmailToken',
    component: VerifyEmailToken
  },
  {
    path: '/news',
    name: 'NewsPage',
    component: NewsPage
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  },
  {
    path: '/terms',
    name: 'TermsOfUse',
    component: TermsOfUse
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
    // redirect to auth-required page and keep the intended route in the query
    next({ name: 'AuthRequired', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
