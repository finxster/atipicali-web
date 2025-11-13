<!--
  Cookie Consent Banner Component
  
  GDPR/Privacy-compliant cookie consent banner
  Matches AtipicALI design system with your brand colors and UI patterns
  
  Features:
  - Clean, modern design matching your app
  - Simple mode (Accept All / Necessary Only)
  - Advanced mode (granular control)
  - Neurodivergent-friendly (clear language, no pressure)
  - Mobile responsive
  - Accessible (keyboard navigation, ARIA labels)
-->

<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-atipicali-blue shadow-2xl"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div class="container mx-auto px-4 py-6 max-w-6xl">
        <!-- Simple Mode (Default) -->
        <div v-if="!showAdvanced">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <!-- Content -->
            <div class="flex-1">
              <h2 id="cookie-banner-title" class="text-lg font-bold text-gray-900 mb-2">
                {{ $t('cookies.title') }}
              </h2>
              <p id="cookie-banner-description" class="text-sm text-gray-700 leading-relaxed">
                {{ $t('cookies.description') }}
                <router-link to="/privacy" class="text-atipicali-blue hover:underline font-medium">
                  {{ $t('cookies.learnMore') }}
                </router-link>
              </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 md:ml-6 mt-4 md:mt-0">
              <button
                @click="handleAcceptNecessary"
                class="btn-secondary py-2 px-4 text-sm whitespace-nowrap"
                aria-label="Accept only necessary cookies"
              >
                {{ $t('cookies.necessaryOnly') }}
              </button>
              <button
                @click="handleAcceptAll"
                class="btn-primary py-2 px-4 text-sm whitespace-nowrap"
                aria-label="Accept all cookies"
              >
                {{ $t('cookies.acceptAll') }}
              </button>
              <button
                @click="showAdvanced = true"
                class="text-sm text-atipicali-blue hover:underline font-medium whitespace-nowrap self-center sm:self-auto"
                aria-label="Customize cookie preferences"
              >
                {{ $t('cookies.customize') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Advanced Mode (Granular Control) -->
        <div v-else>
          <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">
                {{ $t('cookies.customizeTitle') }}
              </h2>
              <button
                @click="showAdvanced = false"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close advanced settings"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Cookie Categories -->
            <div class="space-y-3">
              <!-- Necessary Cookies (Always On) -->
              <div class="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-75">
                    <div class="w-5 h-5 bg-white rounded-full shadow"></div>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">
                    {{ $t('cookies.necessary') }}
                    <span class="text-xs text-gray-500 font-normal ml-2">{{ $t('cookies.alwaysActive') }}</span>
                  </h3>
                  <p class="text-sm text-gray-600">{{ $t('cookies.necessaryDescription') }}</p>
                </div>
              </div>

              <!-- Analytics Cookies (Optional) -->
              <div class="flex items-start space-x-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-atipicali-blue transition-colors">
                <div class="flex-shrink-0 mt-1">
                  <button
                    @click="preferences.analytics = !preferences.analytics"
                    :class="[
                      'w-12 h-6 rounded-full flex items-center transition-all duration-200',
                      preferences.analytics ? 'bg-atipicali-blue justify-end' : 'bg-gray-300 justify-start'
                    ]"
                    :aria-checked="preferences.analytics"
                    role="switch"
                    :aria-label="$t('cookies.analytics')"
                  >
                    <div class="w-5 h-5 bg-white rounded-full shadow"></div>
                  </button>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 mb-1">{{ $t('cookies.analytics') }}</h3>
                  <p class="text-sm text-gray-600">{{ $t('cookies.analyticsDescription') }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                @click="handleSavePreferences"
                class="btn-primary py-2 px-6 text-sm"
                aria-label="Save cookie preferences"
              >
                {{ $t('cookies.savePreferences') }}
              </button>
              <button
                @click="handleAcceptAll"
                class="btn-secondary py-2 px-6 text-sm"
                aria-label="Accept all cookies"
              >
                {{ $t('cookies.acceptAll') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCookieConsent } from '@/composables/useCookieConsent'

const { showBanner, acceptAll, acceptNecessary, acceptSelected } = useCookieConsent()

// UI state
const showAdvanced = ref(false)
const preferences = ref({
  analytics: false,
  marketing: false
})

// Handlers
const handleAcceptAll = () => {
  acceptAll()
}

const handleAcceptNecessary = () => {
  acceptNecessary()
}

const handleSavePreferences = () => {
  acceptSelected(preferences.value)
}
</script>

<style scoped>
/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Ensure banner is above everything except modals */
.z-50 {
  z-index: 50;
}
</style>
