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
            />
          </div>

          <button type="submit" class="btn-primary w-full">
            {{ $t('login.submit') }}
          </button>
        </form>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  console.log('Login attempt:', { email: email.value })
  alert('Login UI ready. Connect to authentication endpoint when backend is available.')
}
</script>
