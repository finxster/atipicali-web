<template>
  <section class="py-20 bg-gradient-to-r from-atipicali-blue to-atipicali-green text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold mb-6">
        {{ $t('cta.title') }}
      </h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">
        {{ $t('cta.description') }}
      </p>
      <router-link to="/add-place" class="btn-secondary bg-white hover:bg-gray-100 text-atipicali-blue border-0 text-lg inline-block">
        {{ $t('cta.addPlace') }}
      </router-link>
    </div>
  </section>
</template>

<script setup>
</script>
