<template>
  <div>
    <Navbar />
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-3xl font-bold mb-6 text-center">{{ $t('login.title') }}</h1>
        

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('login.email') }}
            </label>
            <input 
              v-model="email"
              type="email" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('login.password') }}
            </label>
            <input 
              v-model="password"
              type="password" 
              class="input-field"
              required
              :disabled="loading"
            />
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <span v-if="loading">{{ $t('login.loading') }}</span>
            <span v-else>{{ $t('login.submit') }}</span>
          </button>
        </form>

        <div v-if="error" class="mt-4 text-center text-red-600">
          {{ $t('login.error') }}
        </div>

        <p class="mt-6 text-center text-gray-600">
          {{ $t('login.noAccount') }}
          <router-link to="/register" class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold">
            {{ $t('login.register') }}
          </router-link>
        </p>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>Note:</strong> This is a UI-only page. Connect to POST /api/auth/login 
            when the backend authentication endpoint is ready.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>

import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import api from '../utils/axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = false
  try {
    const response = await api.post('/api/auth/login', {
      email: email.value,
      password: password.value
    })
    const { token, email: userEmail, name } = response.data
  authStore.setToken(token)
  authStore.setUser({ email: userEmail, name })
  // after login, redirect to the intended page (if any) or home
  const redirect = route.query.redirect || '/'
  router.push(redirect)
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>
