<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img 
      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
      alt="Place"
      class="w-full h-48 object-cover"
    />
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
defineProps({
  place: {
    type: Object,
    required: true
  }
})
</script>
