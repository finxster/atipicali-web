<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full">
      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <!-- Email Icon and Heading -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">
            {{ $t('verifyEmail.title') }}
          </h1>
          <p class="text-xl text-gray-600 text-center mb-8">
            {{ $t('verifyEmail.subtitle') }}
          </p>
        </div>

        <!-- Email Display -->
        <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-8">
          <p class="text-gray-700 mb-2">
            <span class="font-semibold">{{ $t('verifyEmail.sentTo') }}</span>
          </p>
          <p class="text-lg font-mono text-green-700 bg-white px-4 py-3 rounded break-all">
            {{ userEmail }}
          </p>
        </div>

        <!-- Information Section -->
        <div class="space-y-4 mb-10">
          <div class="flex gap-4">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-semibold text-gray-900 mb-1">{{ $t('verifyEmail.checkInbox') }}</p>
              <p class="text-gray-600">{{ $t('verifyEmail.checkInboxDesc') }}</p>
            </div>
          </div>

          <div class="flex gap-4">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-semibold text-gray-900 mb-1">{{ $t('verifyEmail.clickLink') }}</p>
              <p class="text-gray-600">{{ $t('verifyEmail.clickLinkDesc') }}</p>
            </div>
          </div>

          <div class="flex gap-4">
            <svg class="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="font-semibold text-gray-900 mb-1">{{ $t('verifyEmail.comeBack') }}</p>
              <p class="text-gray-600">{{ $t('verifyEmail.comeBackDesc') }}</p>
            </div>
          </div>
        </div>

        <!-- Spam Warning -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm text-yellow-800">
                <span class="font-semibold">{{ $t('verifyEmail.checkSpam') }}:</span>
                {{ $t('verifyEmail.checkSpamDesc') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Back to Home -->
          <button
            @click="goHome"
            class="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            {{ $t('verifyEmail.backHome') }}
          </button>

          <!-- Resend Email -->
          <button
            @click="resendEmail"
            :disabled="resendLoading || resendSuccess"
            class="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <svg v-if="resendLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="resendSuccess">{{ $t('verifyEmail.emailSent') }}</span>
            <span v-else-if="resendLoading">{{ $t('verifyEmail.sending') }}</span>
            <span v-else>{{ $t('verifyEmail.resend') }}</span>
          </button>
        </div>

        <!-- Success Message -->
        <transition name="fade">
          <div v-if="resendSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-green-700 text-center font-medium">
              {{ $t('verifyEmail.resendSuccess') }}
            </p>
          </div>
        </transition>
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
const { locale, t } = useI18n()

const userEmail = ref('')
const resendLoading = ref(false)
const resendSuccess = ref(false)

// Map locale to backend language format
const getBackendLanguage = () => {
  return locale.value === 'pt' ? 'pt-br' : 'en'
}

onMounted(() => {
  // Get email from query parameter
  userEmail.value = route.query.email || ''
  
  // If no email provided, redirect to home
  if (!userEmail.value) {
    router.push({ name: 'Home' })
  }
})

const goHome = () => {
  router.push({ name: 'Home' })
}

const resendEmail = async () => {
  resendLoading.value = true
  resendSuccess.value = false

  try {
    // Call backend endpoint to resend verification email
    await api.post('/api/auth/resend-verification-email', {
      email: userEmail.value,
      language: getBackendLanguage()
    })
    
    resendSuccess.value = true
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      resendSuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Error resending email:', err)
    alert(err.response?.data?.message || t('verifyEmail.resendError'))
  } finally {
    resendLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
