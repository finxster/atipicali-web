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
        <!-- Hero Story -->
        <div class="mb-16 max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.hero.title') }}</h2>
          <div class="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>{{ $t('about.hero.description') }}</p>
            
            <!-- Email Contacts - Added here -->
            <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-atipicali-blue">
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:camila@atipicali.com" class="text-atipicali-blue hover:underline font-medium">Camila (camila@atipicali.com)</a>
                <a href="mailto:felipe@atipicali.com" class="text-atipicali-blue hover:underline font-medium">Felipe (felipe@atipicali.com)</a>
              </div>
            </div>
            
            <p>{{ $t('about.hero.realization') }}</p>
            <p v-html="$t('about.hero.birth')"></p>
          </div>
        </div>

        <!-- Name Meaning -->
        <div class="mb-16 max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.nameMeaning.title') }}</h2>
          <div class="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>{{ $t('about.nameMeaning.description') }}</p>
            <p class="bg-blue-50 p-6 rounded-lg border-l-4 border-atipicali-blue" v-html="$t('about.nameMeaning.scene')"></p>
            <p v-html="$t('about.nameMeaning.conclusion')"></p>
          </div>
        </div>

        <!-- Community -->
        <div class="mb-16 max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-gray-800 mb-8">{{ $t('about.community.title') }}</h2>
          <div class="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>{{ $t('about.community.description') }}</p>
            <p class="font-semibold text-gray-800">{{ $t('about.community.youAreProtagonist') }}</p>
            <ul class="space-y-4 ml-6">
              <li class="flex items-start">
                <span class="text-atipicali-blue mr-3 mt-1">•</span>
                <span>{{ $t('about.community.actions.recommend') }}</span>
              </li>
              <li class="flex items-start">
                <span class="text-atipicali-blue mr-3 mt-1">•</span>
                <span>{{ $t('about.community.actions.share') }}</span>
              </li>
              <li class="flex items-start">
                <span class="text-atipicali-blue mr-3 mt-1">•</span>
                <span>{{ $t('about.community.actions.help') }}</span>
              </li>
            </ul>
            <p class="font-medium text-gray-700">{{ $t('about.community.ourRole') }}</p>
          </div>
        </div>

        <!-- CTA -->
        <div class="max-w-4xl mx-auto text-center bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ $t('about.cta.title') }}</h2>
          <p class="text-lg text-gray-600 mb-6">{{ $t('about.cta.description') }}</p>
          <p class="text-xl font-semibold text-atipicali-blue">{{ $t('about.cta.action') }}</p>
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
</script>