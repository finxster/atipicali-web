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

// Response interceptor: handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401 Unauthorized or 403 Forbidden with expired token)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication error - clearing auth state and redirecting to login')
      const authStore = useAuthStore()
      authStore.clearToken()
      
      // Store the current URL to redirect back after login
      const currentPath = window.location.pathname + window.location.search
      
      // Only redirect if not already on auth pages
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && !currentPath.includes('/auth-required')) {
        // Redirect to auth-required page with return URL
        window.location.href = `/auth-required?redirect=${encodeURIComponent(currentPath)}`
      }
    }
    return Promise.reject(error)
  }
)

export default api
