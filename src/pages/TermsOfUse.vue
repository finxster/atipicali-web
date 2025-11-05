<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-atipicali-blue to-atipicali-blue-dark text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ $t('terms.title') }}</h1>
        <p class="text-xl text-gray-100 max-w-3xl mx-auto">{{ $t('terms.subtitle') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
          <!-- Last Updated -->
          <p class="text-gray-600 text-sm mb-8">
            {{ $t('terms.lastUpdated') }}: November 5, 2025
          </p>

          <!-- Section 1 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section1.title') }}</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('terms.section1.content') }}
            </p>
          </section>

          <!-- Section 2 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section2.title') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              {{ $t('terms.section2.intro') }}
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>{{ $t('terms.section2.item1') }}</li>
              <li>{{ $t('terms.section2.item2') }}</li>
              <li>{{ $t('terms.section2.item3') }}</li>
              <li>{{ $t('terms.section2.item4') }}</li>
              <li>{{ $t('terms.section2.item5') }}</li>
            </ul>
          </section>

          <!-- Section 3 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section3.title') }}</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('terms.section3.content') }}
            </p>
          </section>

          <!-- Section 4 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section4.title') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              {{ $t('terms.section4.intro') }}
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-600">
              <li>{{ $t('terms.section4.item1') }}</li>
              <li>{{ $t('terms.section4.item2') }}</li>
              <li>{{ $t('terms.section4.item3') }}</li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section5.title') }}</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('terms.section5.content') }}
            </p>
          </section>

          <!-- Section 6 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section6.title') }}</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('terms.section6.content') }}
            </p>
          </section>

          <!-- Section 7 -->
          <section class="mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.section7.title') }}</h2>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('terms.section7.content') }}
            </p>
          </section>

          <!-- Contact Section -->
          <section class="border-t border-gray-200 pt-8 mt-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('terms.contact.title') }}</h2>
            <p class="text-gray-600 leading-relaxed mb-4">
              {{ $t('terms.contact.description') }}
            </p>
            <a 
              href="mailto:legal@atipicali.com" 
              class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
            >
              legal@atipicali.com
            </a>
          </section>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Footer from '../components/Footer.vue'
</script>
