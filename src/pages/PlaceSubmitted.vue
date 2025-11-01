<template>
  <div>

    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Success Icon -->
        <div class="flex justify-center mb-6">
          <div class="rounded-full bg-green-100 p-6">
            <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Main Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            {{ t('placeSubmitted.title') }}
          </h1>

          <!-- Subtitle -->
          <p class="text-lg text-gray-600 text-center mb-8">
            {{ t('placeSubmitted.subtitle') }}
          </p>

          <!-- Receipt Number -->
          <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div class="text-center">
              <p class="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                {{ t('placeSubmitted.receiptNumber') }}
              </p>
              <p class="text-2xl md:text-3xl font-mono font-bold text-blue-600 break-all">
                {{ placeId }}
              </p>
            </div>
          </div>

          <!-- What's Next Section -->
          <div class="space-y-6 mb-8">
            <h2 class="text-xl font-bold text-gray-900 flex items-center">
              <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ t('placeSubmitted.whatsNextTitle') }}
            </h2>

            <!-- Timeline Steps -->
            <div class="space-y-4 pl-8">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span class="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div class="pt-1">
                  <p class="text-gray-700 font-medium">{{ t('placeSubmitted.step1') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span class="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div class="pt-1">
                  <p class="text-gray-700 font-medium">{{ t('placeSubmitted.step2') }}</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span class="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div class="pt-1">
                  <p class="text-gray-700 font-medium">{{ t('placeSubmitted.step3') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Notice -->
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-yellow-800">
                <strong class="font-semibold">{{ t('placeSubmitted.timelineTitle') }}</strong>
                {{ t('placeSubmitted.timelineMessage') }}
              </p>
            </div>
          </div>

          <!-- Contact Section -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ t('placeSubmitted.questionsTitle') }}
            </h3>
            <p class="text-gray-600 mb-3">{{ t('placeSubmitted.questionsMessage') }}</p>
            <a 
              :href="`mailto:${contactEmail}`" 
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ contactEmail }}
            </a>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              @click="goHome"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {{ t('placeSubmitted.backToHome') }}
            </button>
            <button
              @click="addAnother"
              class="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ t('placeSubmitted.addAnother') }}
            </button>
          </div>
        </div>

        <!-- Additional Help -->
        <div class="text-center mt-8 text-sm text-gray-500">
          <p>{{ t('placeSubmitted.keepReceipt') }}</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const placeId = computed(() => route.params.id || 'N/A')

const contactEmail = computed(() => {
  return locale.value === 'pt' ? 'lugares@atipicali.com' : 'places@atipicali.com'
})

const goHome = () => {
  router.push('/')
}

const addAnother = () => {
  router.push('/add-place')
}
</script>
