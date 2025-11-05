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

          <!-- Location Input with Tag Style (like Gmail) -->
          <div class="relative flex-1">
            <div class="relative w-full">
              <!-- Tag-style container with validation state -->
              <div 
                class="input-field w-full flex items-center gap-2 py-2 pl-3 pr-2 min-h-10"
                :class="locationValidationError ? 'border-red-500 bg-red-50' : ''"
                @click="locationInput?.focus()"
              >
                <!-- Active location tag -->
                <div v-if="displayLocation" class="flex items-center gap-1 bg-atipicali-blue text-white px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 max-w-xs truncate">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ displayLocation.name || 'Selected Location' }}
                  <button 
                    @click.stop="clearSelectedLocation"
                    class="ml-1 hover:opacity-80 transition-opacity"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>

                <!-- Input field -->
                <input 
                  ref="locationInput"
                  v-model="searchForm.location"
                  type="text" 
                  :placeholder="displayLocation ? '' : $t('navbar.selectLocation')"
                  class="flex-1 bg-transparent outline-none text-sm"
                  :class="locationValidationError ? 'placeholder-red-500' : ''"
                  @input="handleLocationInput"
                  @focus="handleLocationFocus"
                  @blur="handleLocationBlur"
                  @keydown.down.prevent="navigateSuggestions(1)"
                  @keydown.up.prevent="navigateSuggestions(-1)"
                  @keydown.enter.prevent="handleLocationEnter"
                  @keydown.escape="showLocationSuggestions = false"
                  autocomplete="off"
                />
              </div>

              <!-- Location Autocomplete Dropdown -->
              <div
                v-if="showLocationSuggestions"
                class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                <!-- Current Location Option (shown only when field is focused, has no input, AND geolocation succeeded) -->
                <button
                  v-if="userLocation && searchForm.location.length === 0"
                  type="button"
                  @mousedown.prevent="selectCurrentLocation"
                  class="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 flex items-start space-x-2"
                  :class="{ 'bg-blue-50': selectedLocationIndex === -1 }"
                >
                  <svg class="w-5 h-5 text-atipicali-blue mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ $t('navbar.currentLocation') }}</p>
                  </div>
                </button>

                <!-- Search suggestions -->
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

                <!-- Helpful text when field is empty (shown whether or not geolocation succeeded) -->
                <div v-if="searchForm.location.length === 0" class="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                  {{ $t('navbar.orStartTyping') }}
                </div>
              </div>

              <!-- Loading indicator -->
              <div v-if="isLoadingLocationSuggestions" class="absolute right-3 top-1/2 -translate-y-1/2">
                <svg class="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <!-- Validation error message -->
              <transition name="fade">
                <div v-if="locationValidationError" class="absolute -bottom-6 left-0 text-red-500 text-xs font-medium">
                  {{ $t('navbar.locationRequired') }}
                </div>
              </transition>
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
import { useLocationStore } from '../stores/location'

const { locale, t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const locationStore = useLocationStore()

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
const userLocation = ref(null)
const fallbackLocation = ref(null)
const locationValidationError = ref(false)
const locationCleared = ref(false) // Track if user manually cleared location

// Computed: Display location (priority: selected > store > userLocation > fallbackLocation)
const displayLocation = computed(() => {
  // If user manually cleared location, don't show anything
  if (locationCleared.value) {
    return null
  }
  
  if (selectedLocation.value) {
    return selectedLocation.value
  }
  if (locationStore.getLocation.value) {
    return locationStore.getLocation.value
  }
  if (userLocation.value) {
    return {
      name: t('navbar.currentLocation'),
      ...userLocation.value
    }
  }
  if (fallbackLocation.value) {
    return fallbackLocation.value
  }
  return null
})

// Default locations for fallback
const DEFAULT_LOCATIONS = {
  en: {
    name: 'San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194
  },
  pt: {
    name: 'São Paulo, Brazil',
    latitude: -23.5505,
    longitude: -46.6333
  }
}

// Request user's geolocation
const requestGeolocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      },
      (error) => {
        console.warn('Geolocation error:', error)
        // Set fallback location based on locale
        const locale_value = locale.value || 'en'
        fallbackLocation.value = DEFAULT_LOCATIONS[locale_value] || DEFAULT_LOCATIONS['en']
      }
    )
  } else {
    // Browser doesn't support geolocation, use fallback
    const locale_value = locale.value || 'en'
    fallbackLocation.value = DEFAULT_LOCATIONS[locale_value] || DEFAULT_LOCATIONS['en']
  }
}

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
  
  // If user starts typing, clear the selected location and the cleared flag
  if (query.length > 0) {
    selectedLocation.value = null
    locationStore.clearLocation()
    locationCleared.value = false
    locationValidationError.value = false
  }
  
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
  const locationName = suggestion.structured_formatting?.main_text || suggestion.description
  searchForm.value.location = '' // Clear input after selection
  showLocationSuggestions.value = false
  locationSuggestions.value = []
  locationCleared.value = false // Reset the cleared flag when user selects a new location

  // Fetch place details to get coordinates
  await fetchLocationDetails(suggestion.place_id, locationName)
}

// Fetch place details to get coordinates
const fetchLocationDetails = async (placeId, locationName = '') => {
  try {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry`
    const proxyUrl = `https://atipicali.com/maps-proxy/?url=${encodeURIComponent(googleApiUrl)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()

    if (data.status === 'OK' && data.result?.geometry?.location) {
      const location = data.result.geometry.location
      selectedLocation.value = {
        name: locationName,
        latitude: parseFloat(location.lat.toFixed(6)),
        longitude: parseFloat(location.lng.toFixed(6))
      }
    }
  } catch (error) {
    console.error('Error fetching location details:', error)
  }
}

// Clear selected location and reset to auto-location
const clearSelectedLocation = () => {
  selectedLocation.value = null
  locationStore.clearLocation()
  searchForm.value.location = ''
  locationValidationError.value = false
  locationCleared.value = true // Mark that user cleared the location
}

// Handle location blur
const handleLocationBlur = () => {
  setTimeout(() => {
    showLocationSuggestions.value = false
  }, 200)
}

// Handle location focus - show current location option
const handleLocationFocus = () => {
  showLocationSuggestions.value = true
  selectedLocationIndex.value = 0
}

// Select current location
const selectCurrentLocation = () => {
  if (!userLocation.value) return
  
  selectedLocation.value = {
    name: t('navbar.currentLocation'),
    latitude: userLocation.value.latitude,
    longitude: userLocation.value.longitude
  }
  searchForm.value.location = ''
  showLocationSuggestions.value = false
  locationCleared.value = false
}

// Handle enter key in location field
const handleLocationEnter = () => {
  // If dropdown is open and has suggestions, select the highlighted one
  if (showLocationSuggestions.value && locationSuggestions.value.length > 0) {
    selectLocationSuggestion(selectedLocationIndex.value)
  } else {
    // Otherwise, close dropdown and trigger search
    showLocationSuggestions.value = false
    handleSearch()
  }
}

// Handle search
const handleSearch = () => {
  // Use displayLocation which has the priority: selected > store > userLocation > fallbackLocation
  let locationToUse = displayLocation.value
  let locationName = displayLocation.value?.name

  // Location is now required
  if (!locationToUse) {
    locationValidationError.value = true
    return
  }

  // Clear validation error if location is present
  locationValidationError.value = false

  isSearching.value = true

  try {
    // Build query params for navigation to search results page
    const queryParams = {
      from: 'search' // Mark that we came from search
    }

    if (searchForm.value.serviceType) {
      queryParams.text = searchForm.value.serviceType
    }

    if (locationToUse) {
      queryParams.latitude = locationToUse.latitude
      queryParams.longitude = locationToUse.longitude
    }

    if (locationName) {
      queryParams.locationName = locationName
    }

    // Navigate to results if we have location or service type
    if (locationToUse || searchForm.value.serviceType) {
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

// On mount, request geolocation and sync location from store
onMounted(() => {
  requestGeolocation()
  locationCleared.value = false // Reset cleared flag on page load
  
  // If location store has a location set (from SearchResults), use it
  if (locationStore.getLocation.value) {
    selectedLocation.value = locationStore.getLocation.value
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>