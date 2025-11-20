import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// Create axios instance with base URL from environment
const baseURL = import.meta.env.VITE_API_BASE_URL
console.log('[axios] baseURL:', baseURL)
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: attach JWT token and Accept-Language header
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // Add Accept-Language header based on current locale from localStorage
    const locale = localStorage.getItem('atipicali_locale') || 'en'
    const language = locale === 'pt' ? 'pt-br' : 'en'
    config.headers['Accept-Language'] = language
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - clearing auth state')
      const authStore = useAuthStore()
      authStore.clearToken()
    }
    return Promise.reject(error)
  }
)

export default api
