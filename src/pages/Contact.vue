<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-atipicali-blue to-atipicali-blue-dark text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ $t('contact.title') }}</h1>
        <p class="text-xl text-gray-100 max-w-3xl mx-auto">{{ $t('contact.subtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-16">
        <div class="grid md:grid-cols-2 gap-12 mb-16">
          <!-- Contact Information -->
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('contact.getInTouch') }}</h2>
            
            <!-- Email -->
            <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
              <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span class="text-2xl">📧</span>
                {{ $t('contact.email') }}
              </h3>
              <p class="text-gray-600">
                <a :href="`mailto:${contactEmail}`" class="text-atipicali-blue hover:text-atipicali-blue-dark transition-colors">
                  {{ contactEmail }}
                </a>
              </p>
            </div>

            <!-- Social Links -->
            <div class="p-6 bg-white rounded-lg shadow-md">
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="text-2xl">🔗</span>
                {{ $t('contact.followUs') }}
              </h3>
              <div class="flex space-x-4">
                <a 
                  href="https://instagram.com/atipicali" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="w-10 h-10 bg-atipicali-blue hover:bg-atipicali-blue-dark text-white rounded-full flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">{{ $t('contact.sendMessage') }}</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">{{ $t('contact.formName') }}</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  :placeholder="$t('contact.formNamePlaceholder')"
                  class="input-field"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-gray-700 font-semibold mb-2">{{ $t('contact.formEmail') }}</label>
                <input 
                  v-model="form.email"
                  type="email" 
                  placeholder="contato@atipicali.com"
                  class="input-field"
                  required
                />
              </div>

              <!-- Subject -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-gray-700 font-semibold">{{ $t('contact.formSubject') }}</label>
                  <span class="text-sm" :class="subjectValid ? 'text-green-600' : subjectLength > 0 ? 'text-red-600' : 'text-gray-500'">
                    {{ subjectLength }}/{{ MAX_SUBJECT_LENGTH }}
                  </span>
                </div>
                <input 
                  v-model="form.subject"
                  type="text" 
                  :placeholder="$t('contact.formSubjectPlaceholder')"
                  class="input-field"
                  :class="{ 'border-red-500': subjectLength > 0 && !subjectValid }"
                  required
                />
                <p v-if="subjectError" class="mt-2 text-sm text-red-600">{{ subjectError }}</p>
              </div>

              <!-- Message -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-gray-700 font-semibold">{{ $t('contact.formMessage') }}</label>
                  <span class="text-sm" :class="messageValid ? 'text-green-600' : messageLength > 0 ? 'text-red-600' : 'text-gray-500'">
                    {{ messageLength }}/{{ MAX_MESSAGE_LENGTH }}
                  </span>
                </div>
                <textarea 
                  v-model="form.message"
                  :placeholder="$t('contact.formMessagePlaceholder')"
                  class="input-field min-h-32 resize-none"
                  :class="{ 'border-red-500': messageLength > 0 && !messageValid }"
                  required
                ></textarea>
                <p v-if="messageError" class="mt-2 text-sm text-red-600">{{ messageError }}</p>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                :disabled="isSubmitting || (form.message.length > 0 && !messageValid) || (form.subject.length > 0 && !subjectValid)"
                class="btn-primary w-full"
              >
                {{ isSubmitting ? $t('contact.sending') : $t('contact.sendMessage') }}
              </button>

              <!-- Success Message -->
              <div v-if="submitSuccess" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                {{ $t('contact.successMessage') }}
              </div>

              <!-- Error Message -->
              <div v-if="submitError" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {{ submitError }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <CTASection />
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import CTASection from '../components/CTASection.vue'
import Footer from '../components/Footer.vue'
import { contactAPI } from '../services/api'

const { locale } = useI18n()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(null)

// Message validation constants
const MIN_MESSAGE_LENGTH = 10
const MAX_MESSAGE_LENGTH = 2000

// Subject validation constants
const MIN_SUBJECT_LENGTH = 5
const MAX_SUBJECT_LENGTH = 200

// Display language-specific email
const contactEmail = computed(() => {
  return locale.value === 'pt' ? 'contato@atipicali.com' : 'hello@atipicali.com'
})

// Message validation
const messageLength = computed(() => form.value.message.length)
const messageValid = computed(() => messageLength.value >= MIN_MESSAGE_LENGTH && messageLength.value <= MAX_MESSAGE_LENGTH)
const messageError = computed(() => {
  if (messageLength.value === 0) return null
  if (messageLength.value < MIN_MESSAGE_LENGTH) {
    return locale.value === 'pt' 
      ? `Mensagem deve ter pelo menos ${MIN_MESSAGE_LENGTH} caracteres (${messageLength.value}/${MIN_MESSAGE_LENGTH})`
      : `Message must be at least ${MIN_MESSAGE_LENGTH} characters (${messageLength.value}/${MIN_MESSAGE_LENGTH})`
  }
  if (messageLength.value > MAX_MESSAGE_LENGTH) {
    return locale.value === 'pt'
      ? `Mensagem não pode exceder ${MAX_MESSAGE_LENGTH} caracteres (${messageLength.value}/${MAX_MESSAGE_LENGTH})`
      : `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters (${messageLength.value}/${MAX_MESSAGE_LENGTH})`
  }
  return null
})

// Subject validation
const subjectLength = computed(() => form.value.subject.length)
const subjectValid = computed(() => subjectLength.value >= MIN_SUBJECT_LENGTH && subjectLength.value <= MAX_SUBJECT_LENGTH)
const subjectError = computed(() => {
  if (subjectLength.value === 0) return null
  if (subjectLength.value < MIN_SUBJECT_LENGTH) {
    return locale.value === 'pt' 
      ? `Assunto deve ter pelo menos ${MIN_SUBJECT_LENGTH} caracteres (${subjectLength.value}/${MIN_SUBJECT_LENGTH})`
      : `Subject must be at least ${MIN_SUBJECT_LENGTH} characters (${subjectLength.value}/${MIN_SUBJECT_LENGTH})`
  }
  if (subjectLength.value > MAX_SUBJECT_LENGTH) {
    return locale.value === 'pt'
      ? `Assunto não pode exceder ${MAX_SUBJECT_LENGTH} caracteres (${subjectLength.value}/${MAX_SUBJECT_LENGTH})`
      : `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters (${subjectLength.value}/${MAX_SUBJECT_LENGTH})`
  }
  return null
})

// Map locale to backend language format
const getBackendLanguage = () => {
  return locale.value === 'pt' ? 'pt-br' : 'en'
}

const submitForm = async () => {
  // Validate message length before submitting
  if (!messageValid.value) {
    submitError.value = messageError.value
    return
  }

  // Validate subject length before submitting
  if (!subjectValid.value) {
    submitError.value = subjectError.value
    return
  }

  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  try {
    // Send the form data to the backend with current language
    await contactAPI.sendContactEmail({
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
      language: getBackendLanguage()
    })

    // Success: reset form and show message
    submitSuccess.value = true
    form.value = { name: '', email: '', subject: '', message: '' }

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Form submission error:', error)
    // Show user-friendly error message
    if (error.response?.data?.message) {
      submitError.value = error.response.data.message
    } else if (error.message) {
      submitError.value = error.message
    } else {
      submitError.value = 'An error occurred while sending your message. Please try again.'
    }

    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      submitError.value = null
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>
