<template>
  <div id="app" class="min-h-screen flex flex-col">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Navbar from './components/Navbar.vue'

const { t, locale } = useI18n()

// Function to update meta tags
const updateMetaTags = () => {
  const title = t('meta.title')
  const description = t('meta.description')
  const fullDescription = t('meta.fullDescription')
  
  // Update document title
  document.title = title
  
  // Update meta tags
  updateMetaTag('name', 'title', title)
  updateMetaTag('name', 'description', description)
  updateMetaTag('itemprop', 'name', title)
  updateMetaTag('itemprop', 'description', fullDescription)
  updateMetaTag('property', 'og:title', title)
  updateMetaTag('property', 'og:description', fullDescription)
  updateMetaTag('name', 'twitter:title', title)
  updateMetaTag('name', 'twitter:description', fullDescription)
}

const updateMetaTag = (attr, attrValue, content) => {
  let element = document.querySelector(`meta[${attr}="${attrValue}"]`)
  if (element) {
    element.setAttribute('content', content)
  }
}

// Update meta tags when locale changes
watch(locale, updateMetaTags, { immediate: true })
</script>
