import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('atipicali_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('atipicali_user') || 'null'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('atipicali_token', newToken)
  }

  function setUser(userData) {
    user.value = userData
    localStorage.setItem('atipicali_user', JSON.stringify(userData))
  }

  function clearToken() {
    token.value = null
    user.value = null
    localStorage.removeItem('atipicali_token')
    localStorage.removeItem('atipicali_user')
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    clearToken
  }
})
