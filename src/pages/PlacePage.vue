<template>
  <div>
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Loading State - Skeleton -->
        <div v-if="loading" class="space-y-8">
          <!-- Image skeleton -->
          <div class="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          
          <!-- Title skeleton -->
          <div class="space-y-4">
            <div class="h-10 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Content skeleton -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left column skeletons -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-gray-200 rounded-lg p-6 animate-pulse h-48"></div>
              <div class="bg-gray-200 rounded-lg p-6 animate-pulse h-48"></div>
              <div class="bg-gray-200 rounded-lg p-6 animate-pulse h-96"></div>
            </div>
            
            <!-- Right column skeletons -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gray-200 rounded-lg p-6 animate-pulse h-48"></div>
              <div class="bg-gray-200 rounded-lg p-6 animate-pulse h-40"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <p class="text-red-700 mb-4">{{ error }}</p>
            <button
              @click="fetchPlace"
              class="px-4 py-2 bg-atipicali-blue text-white rounded-lg hover:bg-blue-700 transition"
            >
              {{ $t('placePage.retry') }}
            </button>
          </div>
        </div>

        <!-- Place Details -->
        <div v-else-if="place">
          <!-- Main Image -->
          <div class="mb-8">
            <img 
              v-if="place.imageUrl"
              :src="place.imageUrl"
              :alt="place.name"
              class="w-full h-96 object-cover rounded-lg"
            />
            <div v-else class="w-full h-96 bg-gradient-to-br from-atipicali-blue-light to-atipicali-blue rounded-lg flex items-center justify-center">
              <svg class="w-24 h-24 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">{{ place.name }}</h1>
          </div>

          <!-- Main Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Left Column: Description and Details -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Description -->
              <section v-if="place.description" class="bg-gray-50 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4">{{ $t('placePage.about') }}</h2>
                <p class="text-gray-700 whitespace-pre-wrap">{{ place.description }}</p>
              </section>

              <!-- Reviews -->
              <section class="bg-white border border-gray-200 p-6 rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-xl font-semibold">{{ $t('placePage.reviews') }}</h3>
                  
                  <!-- Average Rating Display -->
                  <div v-if="reviewsLoaded" class="text-right">
                    <div v-if="averageRating >= 3" class="flex flex-col items-end">
                      <div class="flex items-center gap-2 mb-1">
                        <div class="flex gap-0.5">
                          <span v-for="star in 5" :key="star" class="text-xl">
                            <span v-if="star <= Math.round(averageRating)" class="text-yellow-400">★</span>
                            <span v-else class="text-gray-300">★</span>
                          </span>
                        </div>
                        <span class="font-bold text-lg text-gray-800">{{ averageRating.toFixed(1) }}/5</span>
                      </div>
                      <p class="text-xs text-gray-500">{{ reviews.length }} {{ $t('placePage.reviewCount') }}</p>
                    </div>
                    <div v-else class="bg-gray-100 px-3 py-2 rounded">
                      <p class="text-sm font-semibold text-gray-700">{{ $t('placePage.notEnoughReviews') }}</p>
                      <p class="text-xs text-gray-500">{{ reviews.length }} {{ $t('placePage.reviewCount') }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="reviewsLoaded">
                  <div v-if="reviews.length > 0" class="space-y-4">
                    <div v-for="review in reviews" :key="review.id" class="border-b border-gray-200 pb-4 last:border-b-0">
                      <!-- Review Header -->
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <p class="font-semibold text-gray-800">{{ review.userName }}</p>
                          <p class="text-xs text-gray-500">
                            {{ formatDate(review.createdAt) }}
                          </p>
                        </div>
                        <!-- Star Rating -->
                        <div class="flex items-center gap-1">
                          <div class="flex">
                            <span v-for="star in 5" :key="star" class="text-lg">
                              <span v-if="star <= review.rating" class="text-yellow-400">★</span>
                              <span v-else class="text-gray-300">★</span>
                            </span>
                          </div>
                          <span class="text-sm text-gray-600 ml-1">{{ review.rating }}/5</span>
                        </div>
                      </div>
                      
                      <!-- Review Text -->
                      <p class="text-gray-700 text-sm">{{ review.comment }}</p>
                    </div>
                  </div>

                  <!-- No Reviews -->
                  <div v-else class="text-center py-8">
                    <p class="text-gray-500">{{ $t('placePage.noReviews') }}</p>
                  </div>
                </div>

                <!-- Loading Reviews -->
                <div v-else class="space-y-3">
                  <div v-for="n in 2" :key="n" class="bg-gray-200 rounded animate-pulse h-20"></div>
                </div>
              </section>

              <!-- Review Form -->
              <section v-if="!isDismissed && !userHasReviewed" class="bg-yellow-50 border border-yellow-200 p-6 rounded-lg relative">
                <!-- Dismiss Button -->
                <button
                  @click="isDismissed = true"
                  class="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  :aria-label="$t('common.close')"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h3 class="text-xl font-semibold mb-6 text-gray-800">{{ $t('placePage.shareYourExperience') }}</h3>

                <!-- Login prompt -->
                <div v-if="!isAuthenticated" class="text-center py-8">
                  <p class="text-gray-600 mb-4">{{ $t('placePage.loginToReview') }}</p>
                  <router-link
                    to="/login"
                    class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {{ $t('navbar.login') }}
                  </router-link>
                </div>

                <!-- Review form -->
                <form v-else @submit.prevent="submitReview" class="space-y-4">
                  <!-- Star Rating Input -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3">{{ $t('placePage.selectRating') }}</label>
                    <div class="flex gap-2">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        @click="reviewForm.rating = star"
                        :class="[
                          'text-4xl transition-all cursor-pointer hover:scale-110',
                          star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'
                        ]"
                      >
                        ★
                      </button>
                    </div>
                    <p v-if="reviewForm.rating > 0" class="text-sm text-gray-600 mt-2">
                      {{ reviewForm.rating }}/5 {{ reviewForm.rating === 1 ? 'star' : 'stars' }}
                    </p>
                  </div>

                  <!-- Comment Textarea -->
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">{{ $t('placePage.writeReview') }}</label>
                    <textarea
                      v-model="reviewForm.comment"
                      :placeholder="$t('placePage.reviewPlaceholder')"
                      rows="4"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ reviewForm.comment.length }}/500 characters
                    </p>
                  </div>

                  <!-- Error Message -->
                  <div v-if="reviewError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-700">{{ reviewError }}</p>
                  </div>

                  <!-- Success Message -->
                  <div v-if="reviewSuccess" class="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p class="text-sm text-green-700">{{ $t('placePage.reviewSubmitted') }}</p>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="isSubmittingReview"
                    class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg v-if="isSubmittingReview" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmittingReview ? $t('placePage.submitting') : $t('placePage.submitReview') }}
                  </button>
                </form>
              </section>

              <!-- Service Types -->
              <section v-if="place.serviceTypes && place.serviceTypes.length > 0" class="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">{{ $t('placePage.serviceTypes') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="service in place.serviceTypes"
                    :key="service.id"
                    class="px-4 py-2 bg-atipicali-blue-light text-atipicali-blue rounded-full text-sm font-medium"
                  >
                    {{ isPortuguese ? service.namePt : service.nameEn }}
                  </span>
                </div>
              </section>

              <!-- Map Preview -->
              <section v-if="place.latitude && place.longitude" class="rounded-lg overflow-hidden border border-gray-200">
                <h3 class="text-xl font-semibold p-6 pb-0">{{ $t('placePage.map') }}</h3>
                <div class="p-6">
                  <div class="bg-gray-100 rounded-lg overflow-hidden h-96 mb-4">
                    <iframe
                      :src="`https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`"
                      width="100%"
                      height="100%"
                      style="border:0"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <p class="text-gray-700 font-semibold mb-2">{{ $t('placePage.address') }}</p>
                  <p class="text-gray-600">{{ place.address }}</p>
                </div>
              </section>
            </div>

            <!-- Right Column: Contact Information -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Contact Card -->
              <section class="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 class="text-xl font-semibold mb-4">{{ $t('placePage.contact') }}</h3>
                <div class="space-y-6">
                  <!-- Phone & Website -->
                  <div class="space-y-4">
                    <!-- Phone -->
                    <div v-if="place.contactInfo">
                      <p class="text-sm font-semibold text-gray-700 mb-2">{{ $t('placePage.phone') }}</p>
                      <a
                        :href="`tel:${place.contactInfo}`"
                        class="text-atipicali-blue hover:underline break-all"
                      >
                        {{ place.contactInfo }}
                      </a>
                    </div>

                    <!-- Website -->
                    <div v-if="place.site">
                      <p class="text-sm font-semibold text-gray-700 mb-2">{{ $t('placePage.website') }}</p>
                      <a
                        :href="place.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-atipicali-blue hover:underline break-all flex items-center gap-2"
                      >
                        {{ place.site }}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <!-- No Contact Info -->
                    <div v-if="!place.contactInfo && !place.site" class="text-gray-500 text-sm italic">
                      {{ $t('placePage.contact') }} - No information available
                    </div>
                  </div>

                  <!-- Social Links as Subtitle -->
                  <div v-if="place.socialLinks && place.socialLinks.length > 0" class="border-t border-gray-200 pt-4">
                    <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">{{ $t('placePage.socialLinks') }}</p>
                    <div class="flex gap-3">
                      <a
                        v-for="link in place.socialLinks"
                        :key="link.id"
                        :href="getSocialLink(link.platform, link.account)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-atipicali-blue-light transition-colors"
                        :title="`${link.platform}: ${link.account}`"
                      >
                        <svg v-if="link.platform === 'INSTAGRAM'" class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
                        </svg>
                        <svg v-else-if="link.platform === 'FACEBOOK'" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Back Link -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <router-link
              to="/"
              class="inline-flex items-center gap-2 text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ $t('placePage.back') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '../components/Footer.vue'
import { placeAPI } from '../services/api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const { locale } = useI18n()
const authStore = useAuthStore()

const placeId = route.params.id
const place = ref(null)
const loading = ref(true)
const error = ref(null)
const reviews = ref([])
const reviewsLoaded = ref(false)
const isSubmittingReview = ref(false)
const reviewError = ref(null)
const reviewSuccess = ref(false)

const reviewForm = ref({
  rating: 0,
  comment: ''
})

const isAuthenticated = computed(() => authStore.isAuthenticated)

const isPortuguese = computed(() => locale.value === 'pt')

const isDismissed = ref(false)

const currentUserId = computed(() => {
  return authStore.user?.id || authStore.user?.userId || authStore.user?.email
})

const userHasReviewed = computed(() => {
  // First check if marked as submitted
  if (userSubmittedReview.value) return true
  
  // Then check existing reviews
  if (!currentUserId.value) return false
  
  // Try matching by userId first (if backend provides numeric IDs)
  let hasReview = reviews.value.some(review => review.userId === currentUserId.value)
  
  // If no match by ID and we're using email, try matching by userName or email
  if (!hasReview && authStore.user?.email === currentUserId.value) {
    hasReview = reviews.value.some(review => review.userName === authStore.user?.name)
  }
  
  return hasReview
})

const userSubmittedReview = ref(false)

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return sum / reviews.value.length
})

const fetchPlace = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await placeAPI.getPlace(placeId)
    place.value = response.data
  } catch (err) {
    console.error('Error fetching place:', err)
    error.value = err.response?.data?.message || 'Failed to load place details. Please try again later.'
  } finally {
    loading.value = false
  }
}

const fetchReviews = async () => {
  try {
    reviewsLoaded.value = false
    const response = await placeAPI.getPlaceReviews(placeId)
    reviews.value = Array.isArray(response.data) ? response.data : []
  } catch (err) {
    console.error('Error fetching reviews:', err)
    reviews.value = []
  } finally {
    reviewsLoaded.value = true
  }
}

const submitReview = async () => {
  // Validation
  reviewError.value = null
  reviewSuccess.value = false

  if (!reviewForm.value.rating) {
    reviewError.value = `${locale.value === 'pt' ? 'Por favor, selecione uma avaliação' : 'Please select a rating'}`
    return
  }

  if (reviewForm.value.comment.trim().length < 10) {
    reviewError.value = `${locale.value === 'pt' ? 'Por favor, escreva um comentário (pelo menos 10 caracteres)' : 'Please write a comment (at least 10 characters)'}`
    return
  }

  isSubmittingReview.value = true

  try {
    await placeAPI.submitPlaceReview(placeId, {
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment
    })

    // Success - reset form and mark as submitted
    reviewSuccess.value = true
    reviewForm.value = { rating: 0, comment: '' }
    isDismissed.value = true
    userSubmittedReview.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      reviewSuccess.value = false
    }, 3000)

    // Refresh reviews list
    await fetchReviews()
  } catch (err) {
    console.error('Error submitting review:', err)
    reviewError.value = err.response?.data?.message || `${locale.value === 'pt' ? 'Falha ao enviar sua avaliação. Por favor, tente novamente.' : 'Failed to submit your review. Please try again.'}`
  } finally {
    isSubmittingReview.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getSocialLink = (platform, account) => {
  const links = {
    'INSTAGRAM': `https://instagram.com/${account}`,
    'FACEBOOK': `https://facebook.com/${account}`,
    'TWITTER': `https://twitter.com/${account}`,
    'LINKEDIN': `https://linkedin.com/in/${account}`,
    'TIKTOK': `https://tiktok.com/@${account}`,
    'YOUTUBE': `https://youtube.com/@${account}`
  }
  return links[platform] || '#'
}

onMounted(() => {
  fetchPlace()
  fetchReviews()
})
</script>
