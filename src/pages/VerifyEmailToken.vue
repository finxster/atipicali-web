<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full">
      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <!-- Loading State -->
        <div v-if="verifying" class="text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 animate-pulse">
            <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{{ $t('verifyEmailToken.verifying') }}</h1>
          <p class="text-xl text-gray-600">{{ $t('verifyEmailToken.pleaseWait') }}</p>
        </div>

        <!-- Success State -->
        <div v-else-if="verified && !error" class="text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{{ $t('verifyEmailToken.verified') }}</h1>
          <p class="text-xl text-gray-600 mb-8">{{ $t('verifyEmailToken.welcomeMessage') }}</p>

          <!-- Benefits Section -->
          <div class="space-y-4 mb-10 text-left">
            <div class="flex gap-4">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">{{ $t('verifyEmailToken.benefit1Title') }}</p>
                <p class="text-gray-600 text-sm">{{ $t('verifyEmailToken.benefit1Desc') }}</p>
              </div>
            </div>

            <div class="flex gap-4">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">{{ $t('verifyEmailToken.benefit2Title') }}</p>
                <p class="text-gray-600 text-sm">{{ $t('verifyEmailToken.benefit2Desc') }}</p>
              </div>
            </div>

            <div class="flex gap-4">
              <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">{{ $t('verifyEmailToken.benefit3Title') }}</p>
                <p class="text-gray-600 text-sm">{{ $t('verifyEmailToken.benefit3Desc') }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Home Button -->
            <button
              @click="goHome"
              class="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              {{ $t('verifyEmailToken.backHome') }}
            </button>

            <!-- Login Button -->
            <button
              @click="goLogin"
              class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
            >
              {{ $t('verifyEmailToken.goLogin') }}
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <svg class="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{{ $t('verifyEmailToken.verificationFailed') }}</h1>
          <p class="text-xl text-gray-600 mb-8">{{ error }}</p>

          <!-- Error Guidance -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
            <p class="text-sm text-yellow-800 mb-4">
              <span class="font-semibold">{{ $t('verifyEmailToken.whatToDoTitle') }}:</span>
            </p>
            <ul class="list-disc list-inside space-y-2 text-sm text-yellow-800">
              <li>{{ $t('verifyEmailToken.whatToDo1') }}</li>
              <li>{{ $t('verifyEmailToken.whatToDo2') }}</li>
              <li>{{ $t('verifyEmailToken.whatToDo3') }}</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Home Button -->
            <button
              @click="goHome"
              class="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
            >
              {{ $t('verifyEmailToken.backHome') }}
            </button>

            <!-- Retry Button -->
            <button
              @click="verifyEmail"
              class="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              {{ $t('verifyEmailToken.tryAgain') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '../utils/axios'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const verifying = ref(true)
const verified = ref(false)
const error = ref(null)

onMounted(() => {
  verifyEmail()
})

const verifyEmail = async () => {
  verifying.value = true
  verified.value = false
  error.value = null

  try {
    const token = route.query.token

    if (!token) {
      error.value = t('verifyEmailToken.missingToken')
      verifying.value = false
      return
    }

    // Call backend to verify email with token
    await api.get('/api/auth/verify', {
      params: { token }
    })

    verified.value = true
  } catch (err) {
    console.error('Email verification error:', err)
    error.value = err.response?.data?.message || t('verifyEmailToken.verificationError')
  } finally {
    verifying.value = false
  }
}

const goHome = () => {
  router.push({ name: 'Home' })
}

const goLogin = () => {
  router.push({ 
    name: 'Home',
    query: { openLogin: 'true' }
  })
}
</script>

<style scoped>
</style>

<style scoped>
</style>
