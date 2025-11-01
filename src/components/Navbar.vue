<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/logo.png" alt="Logo" class="w-10 h-10 object-contain bg-white" />
          <span class="text-2xl font-bold text-atipicali-blue">{{ $t('navbar.title') }}</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-2 flex-1 max-w-2xl mx-8">
          <input 
            type="text" 
            :placeholder="$t('navbar.serviceType')"
            class="input-field flex-1"
          />
          <input 
            type="text" 
            :placeholder="$t('navbar.location')"
            class="input-field flex-1"
          />
          <button class="btn-primary whitespace-nowrap">
            {{ $t('navbar.search') }}
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 border-r pr-4">
            <button 
              @click="changeLocale('en')"
              :class="['text-2xl hover:opacity-70 transition-opacity', locale === 'en' ? 'opacity-100' : 'opacity-40']"
              title="English"
            >
              🇺🇸
            </button>
            <button 
              @click="changeLocale('pt')"
              :class="['text-2xl hover:opacity-70 transition-opacity', locale === 'pt' ? 'opacity-100' : 'opacity-40']"
              title="Português"
            >
              🇧🇷
            </button>
          </div>

          <template v-if="isAuthenticated">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-atipicali-blue text-white flex items-center justify-center font-bold">
                {{ avatarLetter }}
              </div>
              <span class="font-semibold text-gray-700">{{ displayName }}</span>
              <button @click="handleLogout" class="ml-2 text-sm text-red-500 hover:underline">Logout</button>
            </div>
          </template>
          <template v-else>
            <router-link to="/register" class="hidden sm:block text-atipicali-blue hover:text-atipicali-blue-dark font-semibold">
              {{ $t('navbar.register') }}
            </router-link>
            <router-link to="/login" class="btn-primary py-2 px-4">
              {{ $t('navbar.login') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'
import { useAuthStore } from '../stores/auth'

const { locale } = useI18n()
const authStore = useAuthStore()
// authStore.isAuthenticated and authStore.user are refs/computed from the store.
// Use the store refs directly. Create derived computed values for template binding
// authStore.isAuthenticated may be a ref or proxied value; wrap in computed for template clarity
const isAuthenticated = computed(() => authStore.isAuthenticated)
// authStore.user is proxied by Pinia; access the reactive object directly (no .value)
const user = authStore.user

// Derived, template-friendly values
const displayName = computed(() => {
  const u = user
  return u ? (u.name || u.email || '') : ''
})

const avatarLetter = computed(() => {
  const u = user
  if (!u) return '?'
  const source = u.name || u.email || ''
  return source ? source.charAt(0).toUpperCase() : '?'
})

// debug logs removed

const changeLocale = (newLocale) => {
  setLocale(newLocale)
}

function handleLogout() {
  authStore.clearToken()
}
</script>
