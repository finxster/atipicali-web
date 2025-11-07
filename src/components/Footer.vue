<template>
  <footer class="bg-gray-800 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="text-2xl font-bold mb-4">AtipicALI</h3>
          <div class="flex space-x-4 mb-4">
            <a href="https://instagram.com/atipicali" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" title="Instagram">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Company</h4>
          <ul class="space-y-2">
            <li><router-link to="/about" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.about') }}</router-link></li>
            <li><router-link to="/contact" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.contact') }}</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2">
            <li><router-link to="/privacy" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.privacy') }}</router-link></li>
            <li><router-link to="/terms" class="text-gray-400 hover:text-white transition-colors">{{ $t('footer.terms') }}</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold mb-4">{{ $t('footer.language') }}</h4>
          <select 
            :value="locale"
            @change="changeLocale($event.target.value)"
            class="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 hover:border-gray-500 cursor-pointer transition-colors"
          >
            <option value="en">🇺🇸 English</option>
            <option value="pt">🇧🇷 Português</option>
          </select>
        </div>
      </div>

      <div class="border-t border-gray-700 pt-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <p class="text-gray-400 text-center md:text-right w-full">{{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { setLocale } from '../i18n'

const { locale } = useI18n()

const changeLocale = (newLocale) => {
  setLocale(newLocale)
}
</script>
