<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div class="container mx-auto px-4 py-6">
        <router-link to="/" class="flex items-center space-x-2 text-atipicali-blue hover:text-atipicali-blue-dark mb-3 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>{{ $t('search.back') }}</span>
        </router-link>
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('search.title') }}</h1>
            <p class="text-sm text-gray-600 mt-1">{{ $t('search.subtitle') }}</p>
          </div>
          <div class="hidden lg:flex items-center space-x-2">
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2',
                viewMode === 'list'
                  ? 'bg-atipicali-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{{ $t('search.viewList') }}</span>
            </button>
            <button
              @click="viewMode = 'map'"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2',
                viewMode === 'map'
                  ? 'bg-atipicali-blue text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{{ $t('search.viewMap') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- No Query Message -->
      <div v-if="!hasQuery" class="text-center py-16">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-600 text-lg">{{ $t('search.noQuery') }}</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="hasError && !isLoading" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-red-700 mb-4">{{ $t('search.error') }}</p>
        <button @click="executeSearch" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          {{ $t('search.retry') }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="flex flex-col lg:flex-row gap-6">
        <!-- Skeleton Filter Sidebar -->
        <div class="lg:w-72 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-4 space-y-6 animate-pulse">
            <div class="h-6 w-24 bg-gray-200 rounded"></div>
            
            <!-- Distance Skeleton -->
            <div>
              <div class="h-4 w-32 bg-gray-200 rounded mb-3"></div>
              <div class="h-2 w-full bg-gray-200 rounded"></div>
            </div>

            <!-- Service Types Skeleton -->
            <div>
              <div class="h-4 w-32 bg-gray-200 rounded mb-3"></div>
              <div class="space-y-2">
                <div class="h-8 w-full bg-gray-200 rounded-full"></div>
                <div class="h-8 w-3/4 bg-gray-200 rounded-full"></div>
                <div class="h-8 w-2/3 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            <!-- Results Count Skeleton -->
            <div class="pt-4 border-t border-gray-200">
              <div class="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Skeleton Content -->
        <div class="flex-1 space-y-4">
          <div v-for="n in 5" :key="n" class="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div class="flex h-32">
              <div class="w-32 h-32 flex-shrink-0 bg-gray-200"></div>
              <div class="flex-1 p-4 space-y-3">
                <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div class="h-4 w-full bg-gray-200 rounded"></div>
                <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Found or No Results - Filters Always Visible -->
      <div v-else-if="hasQuery" class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Filters - Always Visible -->
        <div class="lg:w-72 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-4 sticky top-32 space-y-6">
            <h3 class="font-semibold text-gray-900 text-lg">{{ $t('search.filters') }}</h3>

            <!-- Distance/Radius Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ $t('search.filterByRadius') }}
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="distance in [1, 5, 10, 25, 50]"
                  :key="distance"
                  @click="filterState.distanceKm = distance; applyFilters()"
                  :class="[
                    'px-3 py-2 rounded-lg font-medium text-sm transition-colors',
                    filterState.distanceKm === distance
                      ? 'bg-atipicali-blue text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  {{ distance }}{{ $t('search.km') }}
                </button>
              </div>
            </div>

            <!-- Service Types Filter -->
            <div v-if="allServiceTypes.length > 0">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('search.serviceTypesFilter') }}
                </label>
                <button
                  v-if="filterState.serviceTypeIds.length > 0"
                  @click="clearServiceTypeFilter"
                  class="text-xs text-atipicali-blue hover:text-atipicali-blue-dark font-medium"
                >
                  {{ $t('search.clearSelection') }}
                </button>
              </div>

              <!-- Desktop: Horizontal scrollable pills -->
              <div class="hidden lg:block">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="serviceType in allServiceTypes"
                    :key="serviceType.id"
                    @click="toggleServiceType(serviceType.id)"
                    :class="[
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                      filterState.serviceTypeIds.includes(serviceType.id)
                        ? 'bg-atipicali-blue text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    ]"
                  >
                    {{ getServiceTypeLabel(serviceType) }}
                  </button>
                </div>
              </div>

              <!-- Mobile: Dropdown/Modal -->
              <div class="lg:hidden">
                <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  <label
                    v-for="serviceType in allServiceTypes"
                    :key="serviceType.id"
                    class="flex items-center p-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      :checked="filterState.serviceTypeIds.includes(serviceType.id)"
                      @change="toggleServiceType(serviceType.id)"
                      class="w-4 h-4 text-atipicali-blue rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ getServiceTypeLabel(serviceType) }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Results Count -->
            <div class="pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                <span class="font-semibold text-gray-900">{{ places.length }}</span>
                {{ $t('search.results') }}
              </p>
            </div>

            <!-- Clear All Filters -->
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {{ $t('search.clearFilters') }}
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1">
          <!-- No Results State with Light Background -->
          <div v-if="places.length === 0" class="bg-blue-50 rounded-lg p-12 text-center border border-blue-100">
            <svg class="w-16 h-16 text-blue-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('search.noResults') }}</h3>
            <p class="text-gray-600 mb-4">{{ $t('search.tryAdjustingFilters') }}</p>
            <button
              v-if="hasActiveFilters"
              @click="clearAllFilters"
              class="px-4 py-2 bg-atipicali-blue text-white rounded-lg hover:bg-atipicali-blue-dark transition-colors"
            >
              {{ $t('search.clearFilters') }}
            </button>
          </div>

          <!-- Results List View -->
          <div v-else-if="viewMode === 'list'" class="space-y-4">
            <router-link
              v-for="place in places"
              :key="place.id"
              :to="{ name: 'PlacePage', params: { id: place.id }, query: { from: 'search' } }"
              class="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 hover:border-atipicali-blue"
            >
              <div class="flex h-32">
                <!-- Image -->
                <div class="w-32 h-32 flex-shrink-0 overflow-hidden">
                  <img
                    v-if="place.imageUrl"
                    :src="place.imageUrl"
                    :alt="place.name"
                    class="w-full h-full object-cover"
                    @error="$event.target.style.display = 'none'"
                  />
                  <ImagePlaceholder v-else size="medium" />
                </div>

                <!-- Content -->
                <div class="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 class="font-semibold text-gray-900 text-lg">{{ place.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ place.description }}</p>
                  </div>

                  <!-- Footer Info -->
                  <div class="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span v-if="place.distanceKm">{{ formatDistance(place.distanceKm) }}</span>
                      <span v-else>—</span>
                    </div>
                    <div v-if="place.serviceTypes.length > 0" class="flex flex-wrap gap-1 justify-end">
                      <span
                        v-for="(type, idx) in place.serviceTypes.slice(0, 2)"
                        :key="idx"
                        class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                      >
                        {{ getServiceTypeLabel(type) }}
                      </span>
                      <span v-if="place.serviceTypes.length > 2" class="text-gray-600 text-xs">
                        +{{ place.serviceTypes.length - 2 }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Map View -->
          <div v-else>
            <div class="bg-white rounded-lg shadow-sm overflow-hidden h-96 lg:h-[600px]">
              <iframe
                v-if="mapEmbedUrl"
                :src="mapEmbedUrl"
                class="w-full h-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Search results map"
              ></iframe>
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
                <p class="text-gray-500">{{ $t('search.mapNotAvailable') }}</p>
              </div>
            </div>

            <!-- Mini List on Map View (below map on mobile) -->
            <div class="mt-6 lg:hidden">
              <h3 class="font-semibold text-gray-900 mb-3">{{ $t('search.results') }}: {{ places.length }}</h3>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <router-link
                  v-for="place in places.slice(0, 5)"
                  :key="place.id"
                  :to="{ name: 'PlacePage', params: { id: place.id }, query: { from: 'search' } }"
                  class="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm"
                >
                  <p class="font-medium text-gray-900">{{ place.name }}</p>
                  <p class="text-xs text-gray-600">{{ formatDistance(place.distanceKm) }}</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { placeAPI } from '../services/api'
import Footer from '../components/Footer.vue'
import ImagePlaceholder from '../components/ImagePlaceholder.vue'

const route = useRoute()
const { t, locale } = useI18n()

// State
const places = ref([])
const allServiceTypes = ref([])
const isLoading = ref(false)
const hasError = ref(false)
const viewMode = ref('list')

// Filter state
const filterState = ref({
  distanceKm: 5,
  serviceTypeIds: []
})

// Query parameters from URL
const searchQuery = computed(() => ({
  text: route.query.text || route.query.name || '',
  latitude: parseFloat(route.query.latitude) || null,
  longitude: parseFloat(route.query.longitude) || null
}))

// Check if we have a query
const hasQuery = computed(() => {
  return (
    searchQuery.value.text ||
    (searchQuery.value.latitude !== null && searchQuery.value.longitude !== null)
  )
})

// Check if we have active filters
const hasActiveFilters = computed(() => {
  return filterState.value.serviceTypeIds.length > 0 || filterState.value.distanceKm !== 5
})

// Get service type label based on locale
const getServiceTypeLabel = (serviceType) => {
  if (typeof serviceType === 'string') return serviceType
  if (serviceType.nameEn) {
    return locale.value === 'en' ? serviceType.nameEn : serviceType.namePt
  }
  return serviceType.name || 'Service'
}

// Format distance for display
const formatDistance = (distanceKm) => {
  if (!distanceKm) return '—'
  if (distanceKm < 1) {
    return `${(distanceKm * 1000).toFixed(0)}m`
  }
  return `${distanceKm.toFixed(1)}${t('search.km')}`
}

// Map embed URL for OpenStreetMap with markers
const mapEmbedUrl = computed(() => {
  if (!searchQuery.value.latitude || !searchQuery.value.longitude || places.value.length === 0) {
    return null
  }

  const markers = places.value
    .map((place) => `&marker=${place.latitude},${place.longitude}`)
    .join('')

  return `https://www.openstreetmap.org/export/embed.html?bbox=${searchQuery.value.longitude - 0.1},${
    searchQuery.value.latitude - 0.1
  },${searchQuery.value.longitude + 0.1},${searchQuery.value.latitude + 0.1}&layer=mapnik${markers}`
})

// Build search payload
const buildSearchPayload = () => {
  const payload = {
    limit: 100,
    offset: 0
  }

  if (searchQuery.value.text) {
    payload.text = searchQuery.value.text
  }

  if (searchQuery.value.latitude !== null && searchQuery.value.longitude !== null) {
    payload.latitude = searchQuery.value.latitude
    payload.longitude = searchQuery.value.longitude
    payload.distanceKm = filterState.value.distanceKm
  }

  if (filterState.value.serviceTypeIds.length > 0) {
    payload.serviceTypeIds = filterState.value.serviceTypeIds
  }

  return payload
}

// Execute search
const executeSearch = async () => {
  if (!hasQuery.value) return

  isLoading.value = true
  hasError.value = false

  try {
    const payload = buildSearchPayload()
    const response = await placeAPI.searchPlaces(payload)
    places.value = response.data || []
  } catch (error) {
    console.error('Error searching places:', error)
    hasError.value = true
    places.value = []
  } finally {
    isLoading.value = false
  }
}

// Apply filters (real-time update)
const applyFilters = async () => {
  if (hasQuery.value) {
    await executeSearch()
  }
}

// Toggle service type filter
const toggleServiceType = (serviceTypeId) => {
  const index = filterState.value.serviceTypeIds.indexOf(serviceTypeId)
  if (index > -1) {
    filterState.value.serviceTypeIds.splice(index, 1)
  } else {
    filterState.value.serviceTypeIds.push(serviceTypeId)
  }
  applyFilters()
}

// Clear service type filter
const clearServiceTypeFilter = () => {
  filterState.value.serviceTypeIds = []
  applyFilters()
}

// Clear all filters
const clearAllFilters = () => {
  filterState.value.distanceKm = 5
  filterState.value.serviceTypeIds = []
  executeSearch()
}

// Fetch all available service types
const fetchServiceTypes = async () => {
  try {
    const response = await placeAPI.getServiceTypes()
    allServiceTypes.value = response.data || []
  } catch (error) {
    console.error('Error fetching service types:', error)
    allServiceTypes.value = []
  }
}

// Watch for route changes and execute search
watch(
  () => route.query,
  () => {
    // Reset filters when route changes
    filterState.value.distanceKm = 5
    filterState.value.serviceTypeIds = []
    if (hasQuery.value) {
      executeSearch()
    }
  },
  { deep: true }
)

// Fetch service types and execute initial search on mount
onMounted(() => {
  fetchServiceTypes()
  if (hasQuery.value) {
    executeSearch()
  }
})
</script>
