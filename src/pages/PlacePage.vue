<template>
  <div>
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button - Top -->
        <div v-if="!loading && place" class="mb-8">
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            {{ backButtonLabel }}
          </button>
        </div>

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
            <div v-else class="rounded-lg overflow-hidden">
              <ImagePlaceholder size="large" />
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
                <button
                  @click="redirectToAuth"
                  class="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {{ $t('navbar.login') }}
                </button>
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
              <section class="bg-white border border-gray-200 rounded-lg overflow-hidden relative">
                <div class="bg-gradient-to-r from-atipicali-blue to-blue-600 px-4 py-3">
                  <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {{ $t('placePage.contact') }}
                  </h3>
                </div>
                
                <!-- Contact Information Container with conditional blur -->
                <div class="p-4 space-y-2" :class="{ 'filter blur-sm select-none pointer-events-none': !isAuthenticated }">
                  <!-- Contact Buttons -->
                  <template v-if="place.contactInfo && place.contactInfo.length > 0">
                    <!-- Phone Button -->
                    <a
                      v-for="contact in place.contactInfo.filter(c => c.type === 'PHONE')"
                      :key="contact.id"
                      :href="`tel:${contact.contactValue}`"
                      class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all group"
                    >
                      <div class="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <p class="text-xs font-semibold text-gray-600">{{ $t('placePage.phone') }}</p>
                          <span v-if="contact.isPrimary" class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{{ $t('placePage.primary') }}</span>
                        </div>
                        <p class="text-sm font-medium text-green-700 group-hover:text-green-800 truncate">{{ contact.contactValue }}</p>
                      </div>
                      <svg class="w-4 h-4 text-green-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>

                    <!-- WhatsApp Button -->
                    <a
                      v-for="contact in place.contactInfo.filter(c => c.type === 'WHATSAPP')"
                      :key="contact.id"
                      :href="`https://wa.me/${contact.contactValue.replace(/[^0-9]/g, '')}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
                    >
                      <div class="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <p class="text-xs font-semibold text-gray-600">{{ $t('placePage.whatsapp') }}</p>
                          <span v-if="contact.isPrimary" class="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{{ $t('placePage.primary') }}</span>
                        </div>
                        <p class="text-sm font-medium text-emerald-700 group-hover:text-emerald-800 truncate">{{ contact.contactValue }}</p>
                      </div>
                      <svg class="w-4 h-4 text-emerald-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    <!-- Email Button -->
                    <a
                      v-for="contact in place.contactInfo.filter(c => c.type === 'EMAIL')"
                      :key="contact.id"
                      :href="`mailto:${contact.contactValue}`"
                      class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
                    >
                      <div class="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <p class="text-xs font-semibold text-gray-600">{{ $t('placePage.email') }}</p>
                          <span v-if="contact.isPrimary" class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{{ $t('placePage.primary') }}</span>
                        </div>
                        <p class="text-sm font-medium text-blue-700 group-hover:text-blue-800 truncate">{{ contact.contactValue }}</p>
                      </div>
                      <svg class="w-4 h-4 text-blue-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </template>

                  <!-- No Contact Info -->
                  <div v-if="!place.contactInfo || place.contactInfo.filter(c => c.type !== 'SITE').length === 0" class="text-center py-6 text-gray-500 text-sm">
                    <svg class="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>{{ $t('placePage.noContactInfo') }}</p>
                  </div>
                </div>

                <!-- Website (always visible, outside blurred section) -->
                <div v-if="place.contactInfo && place.contactInfo.find(c => c.type === 'SITE')" class="px-4 pb-4">
                  <a
                    :href="place.contactInfo.find(c => c.type === 'SITE').contactValue"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all group"
                  >
                    <div class="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-gray-600 mb-0.5">{{ $t('placePage.website') }}</p>
                      <p class="text-sm font-medium text-purple-700 group-hover:text-purple-800 truncate">{{ place.contactInfo.find(c => c.type === 'SITE').contactValue }}</p>
                    </div>
                    <svg class="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <!-- Login Overlay for non-authenticated users -->
                <div 
                  v-if="!isAuthenticated && place.contactInfo && place.contactInfo.filter(c => c.type !== 'SITE').length > 0"
                  class="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg"
                >
                  <div class="text-center p-4 max-w-xs">
                    <svg class="w-12 h-12 mx-auto mb-3 text-atipicali-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p class="text-gray-800 font-bold text-base mb-1">{{ $t('placePage.loginToViewContact') }}</p>
                    <p class="text-gray-600 text-xs mb-3">{{ $t('placePage.loginToViewContactDesc') }}</p>
                    <router-link 
                      :to="{ path: '/login', query: { redirect: $route.fullPath } }"
                      class="inline-flex items-center gap-2 px-4 py-2 bg-atipicali-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm shadow-lg hover:shadow-xl"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      {{ $t('login.title') }}
                    </router-link>
                  </div>
                </div>

                <!-- Social Links -->
                <div v-if="place.socialLinks && place.socialLinks.length > 0" class="border-t border-gray-200 p-4">
                  <p class="text-sm font-semibold text-gray-700 mb-3">{{ $t('placePage.socialLinks') }}</p>
                  <div class="flex flex-wrap gap-2">
                    <a
                      v-for="link in place.socialLinks"
                      :key="link.id"
                      :href="getSocialLink(link.platform, link.account)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all group"
                      :title="`${link.platform}: ${link.account}`"
                    >
                      <svg v-if="link.platform === 'INSTAGRAM'" class="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
                      </svg>
                      <svg v-else-if="link.platform === 'FACEBOOK'" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">@{{ link.account }}</span>
                      <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Back Link -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <button
              @click="goBack"
              class="inline-flex items-center gap-2 text-atipicali-blue hover:text-atipicali-blue-dark font-semibold transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              {{ backButtonLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Footer from '../components/Footer.vue'
import ImagePlaceholder from '../components/ImagePlaceholder.vue'
import { placeAPI } from '../services/api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()
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

const userSubmittedReview = ref(false)

const currentUserId = computed(() => {
  return authStore.user?.id || authStore.user?.userId || authStore.user?.email
})

// Smart back button logic
const backButtonLabel = computed(() => {
  // Check if we're coming from search results
  return route.query.from === 'search' ? t('search.back') : t('placePage.back')
})

const goBack = () => {
  // If coming from search results with query params, go back to search
  if (route.query.from === 'search' && window.history.length > 1) {
    router.back()
  } else {
    // Otherwise go home
    router.push('/')
  }
}

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

const onAuthSuccess = () => {
  // Modal will close on success - just ensure form is ready
  isDismissed.value = false
}

const redirectToAuth = () => {
  router.push({
    name: 'AuthRequired',
    query: { redirect: route.fullPath }
  })
}

onMounted(() => {
  fetchPlace()
  fetchReviews()
})
</script>
