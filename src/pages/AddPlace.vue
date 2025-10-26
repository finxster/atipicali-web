<template>
  <div>
    <Navbar />
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-4xl font-bold mb-4">{{ $t('addPlace.title') }}</h1>
        <p class="text-gray-600 mb-8">{{ $t('addPlace.description') }}</p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('addPlace.placeName') }}
            </label>
            <input 
              v-model="formData.name"
              type="text" 
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('addPlace.placeType') }}
            </label>
            <select v-model="formData.type" class="input-field" required>
              <option value="">Select type...</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Café</option>
              <option value="therapy">Therapy Center</option>
              <option value="education">Educational Service</option>
              <option value="recreation">Recreation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('addPlace.address') }}
            </label>
            <input 
              v-model="formData.address"
              type="text" 
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('addPlace.city') }}
            </label>
            <input 
              v-model="formData.city"
              type="text" 
              class="input-field"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 font-semibold mb-2">
              {{ $t('addPlace.description') }}
            </label>
            <textarea 
              v-model="formData.description"
              rows="5"
              class="input-field"
              required
            ></textarea>
          </div>

          <button type="submit" class="btn-primary w-full">
            {{ $t('addPlace.submit') }}
          </button>
        </form>

        <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-gray-700">
            <strong>Note:</strong> This is a UI-only form. Backend POST endpoint integration 
            will be added when the API is ready.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

const formData = ref({
  name: '',
  type: '',
  address: '',
  city: '',
  description: ''
})

const handleSubmit = () => {
  console.log('Form submitted:', formData.value)
  alert('Form submission UI ready. Connect to POST /api/places endpoint when backend is available.')
}
</script>
