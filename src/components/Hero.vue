<template>
  <section 
    class="relative h-screen flex items-center justify-center text-white"
    style="background-image: url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=2000&q=80'); background-size: cover; background-position: center;"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
    
    <div class="relative z-10 text-center px-4 max-w-4xl">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">
        {{ $t('hero.title') }}
      </h1>
      <p class="text-xl md:text-2xl mb-8 text-gray-200">
        {{ $t('hero.description') }}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn-primary text-lg">
          {{ $t('hero.searchPlaces') }}
        </button>
        <router-link to="/add-place" class="btn-secondary text-lg">
          {{ $t('hero.addPlace') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
