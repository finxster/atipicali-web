<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
        {{ $t('news.title') }}
      </h2>
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-atipicali-blue"></div>
        <p class="mt-4 text-gray-600">{{ $t('news.loading') }}</p>
      </div>
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 text-lg">{{ $t('news.error') }}</p>
      </div>
      <div v-else class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="item in newsItems" 
          :key="item.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <img 
            :src="item.image" 
            :alt="item.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-6">
            <p class="text-sm text-gray-500 mb-2">{{ item.date }}</p>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">{{ item.title }}</h3>
            <p class="text-gray-600 mb-4">{{ item.excerpt }}</p>
            <a href="#" class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold">
              {{ $t('news.readMore') }} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../utils/axios'

const newsItems = ref([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = false
  try {
    const { data } = await api.get('/api/public/news')
    newsItems.value = data.map(item => ({
      id: item.id,
      title: item.title,
      date: new Date(item.createdAt).toLocaleDateString(),
      excerpt: item.summary,
      image: item.image || 'https://via.placeholder.com/400x200?text=News',
    }))
  } catch (e) {
    console.error('Error fetching news:', e)
    error.value = true
    newsItems.value = []
  } finally {
    loading.value = false
  }
})
</script>
