<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div class="w-full h-48 overflow-hidden flex items-center justify-center">
      <img 
        v-if="place.imageUrl"
        :src="place.imageUrl"
        :alt="place.name"
        class="w-full h-full object-cover"
        @error="imageError = true"
      />
      <ImagePlaceholder v-else-if="!imageError" size="xlarge" />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 text-gray-800">{{ place.name }}</h3>
      <div class="flex items-center mb-3">
        <span class="text-yellow-400">★★★★★</span>
        <span class="text-gray-600 text-sm ml-2">(0 reviews)</span>
      </div>
      <router-link 
        :to="`/place/${place.id || 1}`"
        class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold"
      >
        {{ $t('recentPlaces.viewDetails') }} →
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

const imageError = ref(false)
</script>

