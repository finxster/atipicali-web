<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
        {{ $t('recentPlaces.title') }}
      </h2>

      <div v-if="loading" class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-6">
            <div class="h-4 w-1/3 bg-gray-200 mb-2 rounded"></div>
            <div class="h-6 w-2/3 bg-gray-200 mb-3 rounded"></div>
            <div class="h-4 w-full bg-gray-200 mb-4 rounded"></div>
            <div class="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ $t('recentPlaces.error') }}</p>
      </div>

      <div v-else class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        <PlaceCard 
          v-for="(place, index) in places" 
          :key="index"
          :place="place"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/axios'
import PlaceCard from './PlaceCard.vue'

const places = ref([])
const loading = ref(true)
const error = ref(false)

const fetchPlaces = async () => {
  try {
    loading.value = true
    error.value = false
    const response = await api.get('/api/public/places/recent')
    places.value = response.data
  } catch (err) {
    console.error('Error fetching places:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPlaces()
})
</script>
