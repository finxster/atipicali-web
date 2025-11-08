<template>
  <div class="min-h-screen bg-gradient-to-br from-atipicali-blue-light to-blue-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-2xl w-full">
      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <!-- Lock Icon and Heading -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-atipicali-blue-light rounded-full mb-6">
            <svg class="w-12 h-12 text-atipicali-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-center">
            {{ $t('authRequired.title') }}
          </h1>
          <p class="text-xl text-gray-600 text-center mb-8">
            {{ $t('authRequired.subtitle') }}
          </p>
        </div>

        <!-- Funny Messages Carousel -->
        <div class="bg-blue-50 border-l-4 border-atipicali-blue rounded-lg p-6 mb-10">
          <div class="flex items-start gap-4">
            <svg class="w-6 h-6 text-atipicali-blue flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <p class="text-lg text-gray-800 italic">
                "{{ funnyMessages[currentMessageIndex] }}"
              </p>
              <div class="flex gap-1 mt-4 justify-center md:justify-start">
                <button
                  v-for="(msg, index) in funnyMessages"
                  :key="index"
                  @click="currentMessageIndex = index"
                  class="w-2 h-2 rounded-full transition-all"
                  :class="currentMessageIndex === index ? 'bg-atipicali-blue w-8' : 'bg-gray-300 hover:bg-gray-400'"
                  :aria-label="`Message ${index + 1}`"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <!-- Login Button -->
          <button
            @click="handleLogin"
            class="group relative px-8 py-4 bg-atipicali-blue text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span class="font-semibold">{{ $t('authRequired.login') }}</span>
            </div>
          </button>

          <!-- Register Button -->
          <button
            @click="handleRegister"
            class="group relative px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div class="flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM9 19c-4.3-1.4-7-4.3-7-8a7 7 0 1114 0c0 3.7-2.7 6.6-7 8z" />
              </svg>
              <span class="font-semibold">{{ $t('authRequired.register') }}</span>
            </div>
          </button>
        </div>

        <!-- Additional Info -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p class="text-gray-700 mb-2">
            <strong>✨ {{ $t('authRequired.benefit') }}</strong>
          </p>
          <p class="text-sm text-gray-600">
            {{ $t('authRequired.benefitDescription') }}
          </p>
        </div>

        <!-- Back Link -->
        <div class="text-center mt-8">
          <button
            @click="goBack"
            class="text-atipicali-blue hover:text-atipicali-blue-dark font-medium inline-flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            {{ $t('authRequired.back') }}
          </button>
        </div>
      </div>
    </div>

    <!-- AuthModal for actual login/register -->
    <AuthModal
      :isOpen="showAuthModal"
      :initialMode="authModalMode"
      @close="showAuthModal = false"
      @success="onAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AuthModal from '../components/AuthModal.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const showAuthModal = ref(false)
const authModalMode = ref('login')
const currentMessageIndex = ref(0)

// Funny messages in different languages
const funnyMessages = ref([
  t('authRequired.message1'),
  t('authRequired.message2'),
  t('authRequired.message3'),
  t('authRequired.message4'),
  t('authRequired.message5'),
])

// Get the page user was trying to access
const getIntendedRoute = () => {
  return route.query.redirect || '/'
}

const handleLogin = () => {
  authModalMode.value = 'login'
  showAuthModal.value = true
}

const handleRegister = () => {
  authModalMode.value = 'register'
  showAuthModal.value = true
}

const onAuthSuccess = () => {
  showAuthModal.value = false
  // Redirect to the page they were trying to access
  const intendedRoute = getIntendedRoute()
  router.push(intendedRoute)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // Rotate funny messages every 5 seconds
  setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % funnyMessages.value.length
  }, 5000)
})
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

.transform {
  transform: translateZ(0);
}

button:active {
  transform: scale(0.98);
}
</style>
