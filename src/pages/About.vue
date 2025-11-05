<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-atipicali-blue to-atipicali-blue-dark text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ $t('about.title') }}</h1>
        <p class="text-xl text-gray-100 max-w-3xl mx-auto">{{ $t('about.subtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-16">
        <!-- Mission Section -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.mission') }}</h2>
          <p class="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {{ $t('about.missionDescription') }}
          </p>
        </div>

        <!-- Vision Section -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.vision') }}</h2>
          <p class="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {{ $t('about.visionDescription') }}
          </p>
        </div>

        <!-- Values Section -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.values') }}</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div
              v-for="(value, index) in values"
              :key="index"
              class="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="text-4xl mb-4">{{ value.icon }}</div>
              <h3 class="text-xl font-bold text-gray-800 mb-3">{{ $t(`about.value${index + 1}.title`) }}</h3>
              <p class="text-gray-600">{{ $t(`about.value${index + 1}.description`) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <CTASection />
    <Footer />
  </div>
</template>

<script setup>
import CTASection from '../components/CTASection.vue'
import Footer from '../components/Footer.vue'

const values = [
  { icon: '♿' },
  { icon: '🤝' },
  { icon: '🌍' }
]
</script>
