<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ $t('placePage.reportIssue') }}</h3>
                <p class="text-sm text-gray-500">{{ placeName }}</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              :aria-label="$t('common.close')"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitReport" class="p-6 space-y-5">
            <!-- Report Type Selection -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                {{ $t('placePage.reportType') }}
                <span class="text-red-500">*</span>
              </label>
              <div class="space-y-2">
                <label
                  v-for="type in reportTypes"
                  :key="type.value"
                  class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all"
                  :class="reportForm.type === type.value 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'"
                >
                  <input
                    type="radio"
                    v-model="reportForm.type"
                    :value="type.value"
                    class="mt-1 text-red-600 focus:ring-red-500"
                  />
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ type.label }}</p>
                    <p class="text-sm text-gray-600">{{ type.description }}</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('placePage.reportDescription') }}
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="reportForm.description"
                :placeholder="$t('placePage.reportDescriptionPlaceholder')"
                rows="5"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                maxlength="1000"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">
                {{ reportForm.description.length }}/1000 {{ $t('placePage.characters') }}
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-green-700">{{ $t('placePage.reportSubmitted') }}</p>
              </div>
            </div>

            <!-- Login Required Message -->
            <div v-if="!isAuthenticated" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-yellow-800">{{ $t('placePage.loginToReport') }}</p>
                  <p class="text-sm text-yellow-700 mt-1">{{ $t('placePage.loginToReportDesc') }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                :disabled="isSubmitting"
              >
                {{ $t('placePage.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !isAuthenticated || !canSubmit"
                class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubmitting ? $t('placePage.submitting') : $t('placePage.submitReport') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { placeAPI } from '../services/api'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  placeId: {
    type: [String, Number],
    required: true
  },
  placeName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'success'])

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const reportForm = ref({
  type: '',
  description: ''
})

const isSubmitting = ref(false)
const error = ref(null)
const success = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const reportTypes = computed(() => [
  {
    value: 'INCORRECT_INFO',
    label: t('placePage.reportTypeIncorrectInfo'),
    description: t('placePage.reportTypeIncorrectInfoDesc')
  },
  {
    value: 'HARMFUL_CONTENT',
    label: t('placePage.reportTypeHarmfulContent'),
    description: t('placePage.reportTypeHarmfulContentDesc')
  },
  {
    value: 'CLOSED',
    label: t('placePage.reportTypeClosed'),
    description: t('placePage.reportTypeClosedDesc')
  },
  {
    value: 'SPAM',
    label: t('placePage.reportTypeSpam'),
    description: t('placePage.reportTypeSpamDesc')
  },
  {
    value: 'OTHER',
    label: t('placePage.reportTypeOther'),
    description: t('placePage.reportTypeOtherDesc')
  }
])

const canSubmit = computed(() => {
  return reportForm.value.type && reportForm.value.description.trim().length >= 10
})

const closeModal = () => {
  if (!isSubmitting.value) {
    resetForm()
    emit('close')
  }
}

const resetForm = () => {
  reportForm.value = {
    type: '',
    description: ''
  }
  error.value = null
  success.value = false
}

const submitReport = async () => {
  // Validation
  error.value = null
  success.value = false

  if (!isAuthenticated.value) {
    error.value = t('placePage.loginToReport')
    return
  }

  if (!reportForm.value.type) {
    error.value = t('placePage.reportTypeRequired')
    return
  }

  if (reportForm.value.description.trim().length < 10) {
    error.value = t('placePage.reportDescriptionRequired')
    return
  }

  isSubmitting.value = true

  try {
    const response = await placeAPI.submitPlaceReport(
      props.placeId,
      {
        reportType: reportForm.value.type,
        description: reportForm.value.description.trim()
      },
      locale.value
    )

    // Close modal and navigate immediately
    emit('close')
    router.push({
      name: 'ReportSubmitted',
      params: { id: response.data?.id || response.data?.reportId || Date.now() },
      query: { placeName: props.placeName }
    })
  } catch (err) {
    console.error('Error submitting report:', err)
    error.value = err.response?.data?.message || t('placePage.reportError')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>
