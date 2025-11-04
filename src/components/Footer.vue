<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-2xl font-bold mb-4">AtipicALI</h3>
          <p class="text-gray-400">
            A trusted directory for the neurodivergent community.
          </p>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Company</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.about') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.contact') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.privacy') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.terms') }}</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Community</h4>
          <div class="flex space-x-4">
            <a href="https://instagram.com/atipicali" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" title="Instagram">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
        <p>{{ $t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
