<template>
  <div>
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6 text-center">{{ $t('register.title') }}</h1>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('register.name') }}
            </label>
            <input 
              v-model="formData.name"
              type="text" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('register.email') }}
            </label>
            <input 
              v-model="formData.email"
              type="email" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('register.password') }}
            </label>
            <input 
              v-model="formData.password"
              type="password" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('register.confirmPassword') }}
            </label>
            <input 
              v-model="formData.confirmPassword"
              type="password" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <span v-if="loading">{{ $t('register.loading') }}</span>
            <span v-else>{{ $t('register.submit') }}</span>
          </button>
        </form>

        <div v-if="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </div>

        <p class="mt-6 text-center text-gray-600">
          {{ $t('register.hasAccount') }}
          <router-link to="/login" class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold">
            {{ $t('register.login') }}
          </router-link>
        </p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Footer from '../components/Footer.vue'
import api from '../utils/axios'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const handleRegister = async () => {
  error.value = null

  // Validation
  if (!formData.value.name.trim()) {
    error.value = 'Name is required'
    return
  }

  if (!formData.value.email.trim()) {
    error.value = 'Email is required'
    return
  }

  if (!validateEmail(formData.value.email)) {
    error.value = 'Please enter a valid email'
    return
  }

  if (!formData.value.password) {
    error.value = 'Password is required'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const response = await api.post('/api/auth/register', {
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password
    })

    const { token, email: userEmail, name } = response.data
    authStore.setToken(token)
    authStore.setUser({ email: userEmail, name })

    // Redirect to home after successful registration
    router.push('/')
  } catch (err) {
    console.error('Register error:', err)
    error.value = err.response?.data?.message || 'Failed to register. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
