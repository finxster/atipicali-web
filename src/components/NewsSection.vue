<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
        {{ $t('news.title') }}
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
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
import { ref } from 'vue'
import newsData from '../data/news.json'

const newsItems = ref(newsData)
</script>
