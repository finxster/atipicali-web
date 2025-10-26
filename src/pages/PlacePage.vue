<template>
  <div>
    <Navbar />
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
          alt="Place"
          class="w-full h-96 object-cover rounded-lg mb-8"
        />
        
        <h1 class="text-4xl font-bold mb-4">Place Name (ID: {{ placeId }})</h1>
        
        <div class="flex items-center mb-6">
          <span class="text-yellow-400 text-2xl">★★★★★</span>
          <span class="text-gray-600 ml-3">(0 reviews)</span>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 class="text-2xl font-semibold mb-4">About This Place</h2>
          <p class="text-gray-700 mb-4">
            This is a placeholder for place details. When the backend API is fully implemented, 
            this page will display complete information including:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Full description and amenities</li>
            <li>Contact information and hours</li>
            <li>Accessibility features</li>
            <li>User reviews and ratings</li>
            <li>Photos and media</li>
          </ul>
        </div>

        <div class="bg-atipicali-blue-light p-6 rounded-lg">
          <h3 class="text-xl font-semibold mb-2">Neurodivergent-Friendly Features</h3>
          <p class="text-gray-700">
            Information about specific accommodations and features that make this place 
            welcoming for the neurodivergent community will be displayed here.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const placeId = route.params.id
</script>
