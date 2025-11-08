<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Transition name="modal-scale">
          <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <!-- Header with Close Button -->
            <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">
                {{ isLogin ? $t('login.title') : $t('register.title') }}
              </h2>
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Optional Message Area -->
            <div v-if="message" class="px-6 pt-6">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-700">{{ message }}</p>
              </div>
            </div>

            <!-- Form Content -->
            <div class="p-6 space-y-6">
              <!-- Login Form -->
              <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('login.email') }}
                  </label>
                  <input
                    v-model="loginForm.email"
                    type="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.email }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('login.password') }}
                  </label>
                  <input
                    v-model="loginForm.password"
                    type="password"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.password }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>

                <button
                  type="submit"
                  class="w-full px-4 py-3 bg-atipicali-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  :disabled="loading"
                >
                  <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="loading">{{ $t('login.loading') }}</span>
                  <span v-else>{{ $t('login.submit') }}</span>
                </button>

                <p class="text-center text-gray-600">
                  {{ $t('login.noAccount') }}
                  <button
                    type="button"
                    @click="toggleMode"
                    class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
                  >
                    {{ $t('login.register') }}
                  </button>
                </p>
              </form>

              <!-- Register Form -->
              <form v-else @submit.prevent="handleRegister" class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('register.name') }}
                  </label>
                  <input
                    v-model="registerForm.name"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.name }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('register.email') }}
                  </label>
                  <input
                    v-model="registerForm.email"
                    type="email"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.email }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('register.password') }}
                  </label>
                  <input
                    v-model="registerForm.password"
                    type="password"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.password }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">
                    {{ $t('register.confirmPassword') }}
                  </label>
                  <input
                    v-model="registerForm.confirmPassword"
                    type="password"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-500': errors.confirmPassword }"
                    required
                    :disabled="loading"
                  />
                  <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-sm text-red-700">{{ error }}</p>
                </div>

                <button
                  type="submit"
                  class="w-full px-4 py-3 bg-atipicali-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  :disabled="loading"
                >
                  <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="loading">{{ $t('register.loading') }}</span>
                  <span v-else>{{ $t('register.submit') }}</span>
                </button>

                <p class="text-center text-gray-600">
                  {{ $t('register.hasAccount') }}
                  <button
                    type="button"
                    @click="toggleMode"
                    class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
                  >
                    {{ $t('register.login') }}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../utils/axios'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialMode: {
    type: String,
    enum: ['login', 'register'],
    default: 'login'
  },
  message: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const router = useRouter()
const authStore = useAuthStore()
const { locale, t } = useI18n()

const getBackendLanguage = () => {
  return locale.value === 'pt' ? 'pt-br' : 'en'
}

const isLogin = ref(props.initialMode === 'login')
const loading = ref(false)
const error = ref(null)
const errors = ref({})

const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = null
  errors.value = {}
}

const closeModal = () => {
  error.value = null
  errors.value = {}
  loginForm.value = { email: '', password: '' }
  registerForm.value = { name: '', email: '', password: '', confirmPassword: '' }
  emit('close')
}

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const handleLogin = async () => {
  errors.value = {}
  error.value = null

  // Validation
  if (!loginForm.value.email.trim()) {
    errors.value.email = t('auth.errors.emailRequired')
    return
  }

  if (!validateEmail(loginForm.value.email)) {
    errors.value.email = t('auth.errors.emailInvalid')
    return
  }

  if (!loginForm.value.password) {
    errors.value.password = t('auth.errors.passwordRequired')
    return
  }

  loading.value = true

  try {
    const response = await api.post('/api/auth/login', {
      email: loginForm.value.email,
      password: loginForm.value.password
    })

    const { token, email: userEmail, name } = response.data
    authStore.setToken(token)
    authStore.setUser({ email: userEmail, name })

    emit('success', 'login')
    closeModal()
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.response?.data?.message || t('auth.errors.loginFailed')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  errors.value = {}
  error.value = null

  // Validation
  if (!registerForm.value.name.trim()) {
    errors.value.name = t('auth.errors.nameRequired')
    return
  }

  if (!registerForm.value.email.trim()) {
    errors.value.email = t('auth.errors.emailRequired')
    return
  }

  if (!validateEmail(registerForm.value.email)) {
    errors.value.email = t('auth.errors.emailInvalid')
    return
  }

  if (!registerForm.value.password) {
    errors.value.password = t('auth.errors.passwordRequired')
    return
  }

  if (registerForm.value.password.length < 6) {
    errors.value.password = t('auth.errors.passwordMinLength')
    return
  }

  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errors.value.confirmPassword = t('auth.errors.passwordMismatch')
    return
  }

  loading.value = true

  try {
    const response = await api.post('/api/auth/register', {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      language: getBackendLanguage()
    })

    // On successful registration, redirect to verify email page
    // Emit close to trigger modal close animation, then navigate
    emit('close')
    await router.push({
      name: 'VerifyEmail',
      query: { email: registerForm.value.email }
    })
  } catch (err) {
    console.error('Register error:', err)
    error.value = err.response?.data?.message || t('auth.errors.registerFailed')
  } finally {
    loading.value = false
  }
}

// Watch for prop changes
watch(() => props.initialMode, (newMode) => {
  isLogin.value = newMode === 'login'
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
