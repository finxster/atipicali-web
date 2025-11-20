<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <!-- Image Container with lazy loading -->
    <div class="w-full h-48 overflow-hidden flex items-center justify-center bg-gray-100 relative">
      <!-- Loading skeleton -->
      <div 
        v-if="imageLoading" 
        class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
      ></div>
      
      <!-- Image -->
      <img 
        v-show="!imageLoading"
        v-if="place.imageUrl"
        :src="place.imageUrl"
        :alt="place.name"
        loading="lazy"
        class="w-full h-full object-cover"
        @load="imageLoading = false"
        @error="handleImageError"
      />
      
      <!-- Fallback placeholder -->
      <ImagePlaceholder v-if="imageError" size="xlarge" />
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{{ place.name }}</h3>
      
      <div class="flex items-center mb-3">
        <span class="text-yellow-400">
          <span v-for="star in 5" :key="star">
            {{ star <= Math.round(place.rating || 0) ? '★' : '☆' }}
          </span>
        </span>
        <span class="text-gray-600 text-sm ml-2">
          {{ place.rating ? place.rating.toFixed(1) : '0.0' }}
        </span>
      </div>
      
      <router-link 
        :to="`/place/${place.id || 1}`"
        class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold inline-flex items-center gap-1"
      >
        {{ $t('recentPlaces.viewDetails') }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ImagePlaceholder from './ImagePlaceholder.vue'

defineProps({
  place: {
    type: Object,
    required: true
  }
})

const imageLoading = ref(true)
const imageError = ref(false)

const handleImageError = () => {
  imageLoading.value = false
  imageError.value = true
}
</script>

