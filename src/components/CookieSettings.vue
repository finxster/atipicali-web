<template>
  <div class="cookie-settings-section">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('cookies.settings.title') }}</h2>
    
    <div class="bg-gray-50 rounded-lg p-6 mb-6">
      <p class="text-gray-700 mb-4">
        {{ $t('cookies.settings.description') }}
      </p>
      
      <!-- Current Status -->
      <div class="mb-6">
        <h3 class="font-semibold text-gray-900 mb-2">{{ $t('cookies.settings.currentSettings') }}</h3>
        <ul class="space-y-2">
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">
              {{ $t('cookies.settings.necessaryCookies') }}: 
              <strong>{{ $t('cookies.settings.enabled') }}</strong> 
              ({{ $t('cookies.settings.alwaysRequired') }})
            </span>
          </li>
          <li class="flex items-center text-sm">
            <svg 
              v-if="hasAnalyticsConsent" 
              class="w-5 h-5 text-green-500 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <svg 
              v-else 
              class="w-5 h-5 text-red-500 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span class="text-gray-700">
              {{ $t('cookies.settings.analyticsCookies') }}: 
              <strong>{{ hasAnalyticsConsent ? $t('cookies.settings.enabled') : $t('cookies.settings.disabled') }}</strong>
            </span>
          </li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-3">
        <button
          @click="handleManageConsent"
          class="btn-primary py-2 px-4 text-sm"
        >
          {{ $t('cookies.settings.managePreferences') }}
        </button>
        
        <button
          v-if="hasAnalyticsConsent"
          @click="handleRevokeConsent"
          class="btn-secondary py-2 px-4 text-sm"
        >
          {{ $t('cookies.settings.disableAnalytics') }}
        </button>
        
        <button
          v-else
          @click="handleEnableAnalytics"
          class="btn-secondary py-2 px-4 text-sm"
        >
          {{ $t('cookies.settings.enableAnalytics') }}
        </button>
      </div>
      
      <p class="text-xs text-gray-500 mt-4">
        {{ $t('cookies.settings.refreshNote') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useCookieConsent } from '@/composables/useCookieConsent'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { 
  hasAnalyticsConsent, 
  showConsentBanner, 
  revokeConsent,
  acceptAll 
} = useCookieConsent()

const handleManageConsent = () => {
  // Show the cookie banner again for user to customize
  showConsentBanner()
  
  // Scroll to bottom to see the banner
  setTimeout(() => {
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    })
  }, 100)
}

const handleRevokeConsent = () => {
  if (confirm(t('cookies.settings.confirmDisable'))) {
    revokeConsent()
    window.location.reload()
  }
}

const handleEnableAnalytics = () => {
  if (confirm(t('cookies.settings.confirmEnable'))) {
    acceptAll()
    // acceptAll() already reloads the page
  }
}
</script>

<style scoped>
/* Uses your existing btn-primary and btn-secondary classes */
</style>
