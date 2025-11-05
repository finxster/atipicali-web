<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/logo.png" alt="Logo" class="w-10 h-10 object-contain bg-white" />
          <span class="text-2xl font-bold text-atipicali-blue">{{ $t('navbar.title') }}</span>
        </router-link>

        <div class="hidden md:flex items-center space-x-2 flex-1 max-w-2xl mx-8">
          <!-- Service Type Input -->
          <input 
            v-model="searchForm.serviceType"
            type="text" 
            :placeholder="$t('navbar.serviceType')"
            class="input-field flex-1"
            @keydown.enter="handleSearch"
          />

          <!-- Location Input with Autocomplete -->
          <div class="relative flex-1">
            <input 
              ref="locationInput"
              v-model="searchForm.location"
              type="text" 
              :placeholder="$t('navbar.location')"
              class="input-field w-full"
              @input="handleLocationInput"
              @focus="showLocationSuggestions = true"
              @blur="handleLocationBlur"
              @keydown.down.prevent="navigateSuggestions(1)"
              @keydown.up.prevent="navigateSuggestions(-1)"
              @keydown.enter.prevent="selectLocationSuggestion(selectedLocationIndex)"
              @keydown.escape="showLocationSuggestions = false"
              autocomplete="off"
            />

            <!-- Location Autocomplete Dropdown -->
            <div
              v-if="showLocationSuggestions && locationSuggestions.length > 0"
              class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
            >
              <button
                v-for="(suggestion, index) in locationSuggestions"
                :key="suggestion.place_id"
                type="button"
                @mousedown.prevent="selectLocationSuggestion(index)"
                class="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start space-x-2"
                :class="{ 'bg-blue-50': index === selectedLocationIndex }"
              >
                <svg class="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ suggestion.structured_formatting?.main_text || suggestion.description }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ suggestion.structured_formatting?.secondary_text || '' }}</p>
                </div>
              </button>
            </div>

            <!-- Loading indicator -->
            <div v-if="isLoadingLocationSuggestions" class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg class="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>

          <!-- Search Button -->
          <button 
            @click="handleSearch"
            :disabled="isSearching"
            class="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg v-if="isSearching" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ $t('navbar.search') }}</span>
          </button>
        </div>

        <div class="flex items-center space-x-4">
          <router-link to="/add-place" class="hidden sm:block bg-atipicali-green hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
            {{ $t('navbar.createPlace') }}
          </router-link>

          <div class="hidden sm:block border-l pl-4"></div>

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
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { setLocale } from '../i18n'
import { useAuthStore } from '../stores/auth'

const { locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Authentication
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = authStore.user
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

// Search form state
const searchForm = ref({
  serviceType: '',
  location: ''
})

// Location autocomplete state
const locationInput = ref(null)
const locationSuggestions = ref([])
const showLocationSuggestions = ref(false)
const isLoadingLocationSuggestions = ref(false)
const selectedLocationIndex = ref(0)
let locationDebounceTimer = null

// Search state
const isSearching = ref(false)
const selectedLocation = ref(null)

// Fetch location suggestions from Google Places API via proxy
const fetchLocationSuggestions = async (query) => {
  if (!query || query.length < 3) return

  isLoadingLocationSuggestions.value = true
  selectedLocationIndex.value = 0

  try {
    const encodedQuery = encodeURIComponent(query)
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedQuery}&types=address`
    const proxyUrl = `https://atipicali.com/maps-proxy/?url=${encodeURIComponent(googleApiUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()

    if (data.status === 'OK' && data.predictions) {
      locationSuggestions.value = data.predictions
      showLocationSuggestions.value = true
    } else {
      locationSuggestions.value = []
      showLocationSuggestions.value = false
    }
  } catch (error) {
    console.error('Error fetching location suggestions:', error)
    locationSuggestions.value = []
    showLocationSuggestions.value = false
  } finally {
    isLoadingLocationSuggestions.value = false
  }
}

// Handle location input with debouncing
const handleLocationInput = () => {
  if (locationDebounceTimer) clearTimeout(locationDebounceTimer)

  const query = searchForm.value.location.trim()
  if (query.length < 3) {
    locationSuggestions.value = []
    showLocationSuggestions.value = false
    return
  }

  locationDebounceTimer = setTimeout(() => {
    fetchLocationSuggestions(query)
  }, 300)
}

// Navigate through suggestions with keyboard
const navigateSuggestions = (direction) => {
  if (locationSuggestions.value.length === 0) return
  selectedLocationIndex.value += direction
  if (selectedLocationIndex.value < 0) selectedLocationIndex.value = locationSuggestions.value.length - 1
  else if (selectedLocationIndex.value >= locationSuggestions.value.length) selectedLocationIndex.value = 0
}

// Select a location suggestion
const selectLocationSuggestion = async (index) => {
  if (index < 0 || index >= locationSuggestions.value.length) return

  const suggestion = locationSuggestions.value[index]
  searchForm.value.location = suggestion.description
  showLocationSuggestions.value = false
  locationSuggestions.value = []

  // Fetch place details to get coordinates
  await fetchLocationDetails(suggestion.place_id)
}

// Fetch place details to get coordinates
const fetchLocationDetails = async (placeId) => {
  try {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry`
    const proxyUrl = `https://atipicali.com/maps-proxy/?url=${encodeURIComponent(googleApiUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()

    if (data.status === 'OK' && data.result?.geometry?.location) {
      const location = data.result.geometry.location
      selectedLocation.value = {
        latitude: parseFloat(location.lat.toFixed(6)),
        longitude: parseFloat(location.lng.toFixed(6))
      }
    }
  } catch (error) {
    console.error('Error fetching location details:', error)
  }
}

// Handle location blur
const handleLocationBlur = () => {
  setTimeout(() => {
    showLocationSuggestions.value = false
  }, 200)
}

// Handle search
const handleSearch = () => {
  if (!searchForm.value.serviceType && !searchForm.value.location && !selectedLocation.value) {
    return
  }

  isSearching.value = true

  try {
    // Build query params for navigation to search results page
    const queryParams = {
      from: 'search' // Mark that we came from search
    }

    if (searchForm.value.serviceType) {
      queryParams.text = searchForm.value.serviceType
    }

    if (selectedLocation.value) {
      queryParams.latitude = selectedLocation.value.latitude
      queryParams.longitude = selectedLocation.value.longitude
    }

    // If we have at least some search criteria, navigate to results
    if (Object.keys(queryParams).length > 1) { // > 1 because of 'from' parameter
      router.push({
        name: 'SearchResults',
        query: queryParams
      })
    }
  } finally {
    isSearching.value = false
  }
}

// Handle logout
const handleLogout = () => {
  authStore.clearToken()
}

const changeLocale = (newLocale) => {
  setLocale(newLocale)
}
</script>
