<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        {{ $t('newsPage.title') }}
      </h1>
      <p class="text-lg text-gray-600 mb-12">
        {{ $t('newsPage.subtitle') }}
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main content -->
        <div class="lg:col-span-2">
          <!-- Loading state -->
          <div v-if="loading" class="space-y-6">
            <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="w-full h-64 bg-gray-200"></div>
              <div class="p-8">
                <div class="h-6 w-1/3 bg-gray-200 mb-2 rounded"></div>
                <div class="h-8 w-2/3 bg-gray-200 mb-4 rounded"></div>
                <div class="space-y-2 mb-4">
                  <div class="h-4 w-full bg-gray-200 rounded"></div>
                  <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
                <div class="flex gap-4">
                  <div class="h-4 w-24 bg-gray-200 rounded"></div>
                  <div class="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
            <p class="text-red-500 text-lg">{{ $t('newsPage.error') }}</p>
            <button
              @click="fetchNews"
              class="mt-4 px-6 py-2 bg-atipicali-blue text-white rounded-lg hover:bg-atipicali-blue-dark transition-colors"
            >
              {{ $t('newsPage.retry') }}
            </button>
          </div>

          <!-- Articles list -->
          <div v-else class="space-y-6">
            <article
              v-for="article in paginatedArticles"
              :key="article.id"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <!-- Featured image or placeholder -->
              <div class="w-full h-64 bg-gradient-to-br from-atipicali-blue-light to-atipicali-blue flex items-center justify-center">
                <svg class="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>

              <div class="p-8">
                <!-- Meta info -->
                <div class="flex items-center gap-4 mb-3 text-sm text-gray-500">
                  <time :datetime="article.createdAt">
                    {{ formatDate(article.createdAt) }}
                  </time>
                  <span>{{ article.author }}</span>
                  <span class="bg-atipicali-blue-light text-atipicali-blue px-2 py-1 rounded text-xs">
                    {{ article.readingTime }}
                  </span>
                </div>

                <!-- Title -->
                <h2 class="text-3xl font-bold mb-3 text-gray-800 hover:text-atipicali-blue transition-colors">
                  {{ article.title }}
                </h2>

                <!-- Summary -->
                <p class="text-gray-600 mb-6">{{ article.summary }}</p>

                <!-- Read more button -->
                <button
                  @click="selectArticle(article)"
                  class="text-atipicali-blue hover:text-atipicali-blue-dark font-semibold flex items-center gap-2 transition-colors"
                >
                  {{ $t('newsPage.readMore') }} →
                </button>
              </div>
            </article>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ $t('newsPage.previous') }}
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-3 py-2 rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-atipicali-blue text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ $t('newsPage.next') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <!-- Sidebar title -->
          <div class="bg-atipicali-blue text-white rounded-lg shadow-md p-6 mb-6">
            <h3 class="text-xl font-bold">{{ $t('newsPage.allArticles') }}</h3>
            <p class="text-atipicali-blue-light text-sm mt-1">
              {{ totalArticles }} {{ $t('newsPage.articlesCount') }}
            </p>
          </div>

          <!-- Articles sidebar list -->
          <div
            v-if="!loading && allArticles.length > 0"
            class="bg-white rounded-lg shadow-md overflow-hidden sticky top-4"
          >
            <div class="max-h-96 overflow-y-auto">
              <button
                v-for="(article, index) in allArticles"
                :key="article.id"
                @click="selectArticle(article)"
                :class="[
                  'w-full text-left px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors',
                  selectedArticle?.id === article.id && 'bg-atipicali-blue-light border-l-4 border-l-atipicali-blue'
                ]"
              >
                <p class="text-sm text-gray-500 mb-1">{{ formatDate(article.createdAt) }}</p>
                <p class="font-semibold text-gray-800 line-clamp-2">{{ article.title }}</p>
                <p class="text-xs text-gray-600 mt-2">{{ article.readingTime }}</p>
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!loading" class="bg-white rounded-lg shadow-md p-6 text-center">
            <p class="text-gray-600">{{ $t('newsPage.noArticles') }}</p>
          </div>
        </aside>
      </div>

      <!-- Full article modal/view -->
      <div v-if="selectedArticle" class="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div class="min-h-screen flex items-center justify-center p-4">
          <div class="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6 z-10">
              <h2 class="text-3xl font-bold text-gray-800 flex-1 pr-4">{{ selectedArticle.title }}</h2>
              <button
                @click="selectedArticle = null"
                class="text-gray-500 hover:text-gray-700 text-2xl flex-shrink-0"
              >
                ×
              </button>
            </div>

            <!-- Article meta -->
            <div class="px-6 pt-6 pb-4 border-b border-gray-200 flex flex-wrap gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ $t('newsPage.author') }}:</span>
                <span>{{ selectedArticle.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ $t('newsPage.published') }}:</span>
                <time :datetime="selectedArticle.createdAt">
                  {{ formatDateLong(selectedArticle.createdAt) }}
                </time>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ $t('newsPage.readingTime') }}:</span>
                <span>{{ selectedArticle.readingTime }}</span>
              </div>
            </div>

            <!-- Article content -->
            <div class="p-6 md:p-8">
              <!-- Summary -->
              <p class="text-lg text-gray-600 mb-6 italic border-l-4 border-atipicali-blue pl-4">
                {{ selectedArticle.summary }}
              </p>

              <!-- HTML content -->
              <div
                class="prose prose-lg max-w-none text-gray-800"
                v-html="sanitizedContent"
              ></div>
            </div>

            <!-- Footer navigation -->
            <div class="px-6 md:px-8 pb-6 border-t border-gray-200 flex justify-between">
              <button
                @click="previousArticle"
                :disabled="!hasPreviousArticle"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← {{ $t('newsPage.previousArticle') }}
              </button>
              <button
                @click="selectedArticle = null"
                class="px-4 py-2 rounded-lg bg-atipicali-blue text-white hover:bg-atipicali-blue-dark transition-colors"
              >
                {{ $t('newsPage.backToList') }}
              </button>
              <button
                @click="nextArticle"
                :disabled="!hasNextArticle"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ $t('newsPage.nextArticle') }} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/axios'
import DOMPurify from 'dompurify'

const route = useRoute()
const allArticles = ref([])
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(5)
const selectedArticle = ref(null)

const totalArticles = computed(() => allArticles.value.length)
const totalPages = computed(() => Math.ceil(totalArticles.value / itemsPerPage.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return allArticles.value.slice(start, end)
})

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const sanitizedContent = computed(() => {
  if (!selectedArticle.value) return ''
  return DOMPurify.sanitize(selectedArticle.value.content)
})

const selectedArticleIndex = computed(() => {
  return allArticles.value.findIndex(a => a.id === selectedArticle.value?.id)
})

const hasPreviousArticle = computed(() => selectedArticleIndex.value > 0)
const hasNextArticle = computed(() => selectedArticleIndex.value < allArticles.value.length - 1)

const fetchNews = async () => {
  loading.value = true
  error.value = false
  try {
    const { data } = await api.get('/api/public/news')
    allArticles.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error fetching news:', e)
    error.value = true
    allArticles.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateLong = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const selectArticle = (article) => {
  selectedArticle.value = article
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextArticle = () => {
  if (hasNextArticle.value) {
    selectedArticle.value = allArticles.value[selectedArticleIndex.value + 1]
  }
}

const previousArticle = () => {
  if (hasPreviousArticle.value) {
    selectedArticle.value = allArticles.value[selectedArticleIndex.value - 1]
  }
}

onMounted(async () => {
  await fetchNews()
  
  // Check if an article ID was passed via query parameter
  if (route.query.articleId) {
    const article = allArticles.value.find(a => a.id === route.query.articleId)
    if (article) {
      selectedArticle.value = article
    }
  }
})

// Watch for route changes to handle the article ID query parameter
watch(() => route.query.articleId, (newArticleId) => {
  if (newArticleId) {
    const article = allArticles.value.find(a => a.id === newArticleId)
    if (article) {
      selectedArticle.value = article
    }
  }
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Prose styling */
:deep(.prose) {
  color: #1f2937;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  color: #111827;
  font-weight: 700;
}

:deep(.prose a) {
  color: #0061ff;
  text-decoration: none;
}

:deep(.prose a:hover) {
  text-decoration: underline;
}

:deep(.prose p) {
  margin-bottom: 1rem;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

:deep(.prose blockquote) {
  border-left-width: 4px;
  border-color: #0061ff;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  color: #dc2626;
}

:deep(.prose pre) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

:deep(.prose pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
}

/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
