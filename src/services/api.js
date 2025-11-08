import axios from 'axios'
import { useAuthStore } from '../stores/auth'

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
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

// Place API methods
export const placeAPI = {
  getPlace: (id) => api.get(`/api/public/places/${id}`),
  getPlaceReviews: (id) => api.get(`/api/public/places/${id}/reviews`),
  submitPlaceReview: (placeId, data) => api.post(`/api/places/${placeId}/reviews`, data),
  // Search places with advanced filters using POST endpoint
  searchPlaces: (payload) => api.post('/api/public/places/search', payload),
  // Get all available service types
  getServiceTypes: () => api.get('/api/public/service-types')
}

// Auth API methods
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (name, email, password) => api.post('/api/auth/register', { name, email, password })
}

// Contact API methods
export const contactAPI = {
  sendContactEmail: (data) => api.post('/api/public/contact/send-email', data)
}

export default api
