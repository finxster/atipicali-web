<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
        {{ $t('recentPlaces.title') }}
      </h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-atipicali-blue"></div>
        <p class="mt-4 text-gray-600">{{ $t('recentPlaces.loading') }}</p>
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
    const response = await api.get('/api/public/places')
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
