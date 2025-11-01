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
            />
          </div>

          <button type="submit" class="btn-primary w-full">
            {{ $t('register.submit') }}
          </button>
        </form>

        <p class="mt-6 text-center text-gray-600">
          {{ $t('register.hasAccount') }}
          <router-link to="/login" class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold">
            {{ $t('register.login') }}
          </router-link>
        </p>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>Note:</strong> This is a UI-only page. Connect to POST /api/auth/register 
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
import Footer from '../components/Footer.vue'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  
  console.log('Register attempt:', formData.value)
  alert('Registration UI ready. Connect to authentication endpoint when backend is available.')
}
</script>
