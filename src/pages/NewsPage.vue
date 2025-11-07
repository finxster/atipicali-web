<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
        {{ $t('newsPage.title') }}
      </h1>
      <p class="text-lg text-gray-600 mb-12">
        {{ $t('newsPage.subtitle') }}
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main content -->
        <div class="lg:col-span-3">
          <!-- Loading state -->
          <div v-if="loading" class="space-y-8">
            <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div class="w-full h-96 bg-gray-200"></div>
              <div class="p-8">
                <div class="h-6 w-1/3 bg-gray-200 mb-2 rounded"></div>
                <div class="h-8 w-2/3 bg-gray-200 mb-4 rounded"></div>
                <div class="space-y-2 mb-4">
                  <div class="h-4 w-full bg-gray-200 rounded"></div>
                  <div class="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div class="h-4 w-4/6 bg-gray-200 rounded"></div>
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

          <!-- Articles blog-style -->
          <div v-else class="space-y-12">
            <article
              v-for="article in displayedArticles"
              :key="article.id"
              :id="`article-${article.id}`"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <!-- Featured image -->
              <img 
                v-if="article.imageUrl"
                :src="article.imageUrl"
                :alt="article.title"
                class="w-full h-96 object-cover"
              />
              <ImagePlaceholder v-else size="xlarge" />

              <!-- Article content -->
              <div class="p-8 md:p-12">
                <!-- Meta info -->
                <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
                  <time :datetime="article.createdAt">
                    {{ formatDateLong(article.createdAt) }}
                  </time>
                  <span v-if="article.author">{{ article.author }}</span>
                  <span class="bg-atipicali-blue-light text-atipicali-blue px-2 py-1 rounded text-xs">
                    {{ article.readingTime }}
                  </span>
                </div>

                <!-- Title -->
                <h2 class="text-4xl font-bold mb-4 text-gray-800">
                  {{ article.title }}
                </h2>

                <!-- Summary/Excerpt -->
                <p class="text-lg text-gray-600 mb-6 italic border-l-4 border-atipicali-blue pl-4">
                  {{ article.summary }}
                </p>

                <!-- Full HTML content -->
                <div
                  class="prose prose-lg max-w-none text-gray-800"
                  v-html="sanitizedContent(article)"
                ></div>
              </div>
            </article>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-center gap-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← {{ $t('newsPage.previous') }}
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
                {{ $t('newsPage.next') }} →
              </button>
            </div>

            <!-- No articles -->
            <div v-if="allArticles.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
              <p class="text-gray-600">{{ $t('newsPage.noArticles') }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar - Article Index -->
        <aside class="lg:col-span-1">
          <!-- Sidebar card -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden sticky top-4 max-h-fit">
            <!-- Header -->
            <div class="bg-atipicali-blue text-white p-6">
              <h3 class="text-lg font-bold">{{ $t('newsPage.allArticles') }}</h3>
              <p class="text-atipicali-blue-light text-sm mt-2">
                {{ totalArticles }} {{ $t('newsPage.articlesCount') }}
              </p>
            </div>

            <!-- Articles list -->
            <div v-if="!loading && allArticles.length > 0" class="max-h-96 overflow-y-auto">
              <button
                v-for="article in allArticles"
                :key="article.id"
                @click="scrollToArticle(article.id)"
                :class="[
                  'w-full text-left px-6 py-4 border-b border-gray-200 hover:bg-atipicali-blue-light transition-colors',
                  isCurrentArticle(article.id) && 'bg-atipicali-blue-light border-l-4 border-l-atipicali-blue'
                ]"
              >
                <p class="text-sm text-gray-500 mb-1">{{ formatDateShort(article.createdAt) }}</p>
                <p class="font-semibold text-gray-800 line-clamp-2 text-sm">{{ article.title }}</p>
              </button>
            </div>

            <!-- Empty state -->
            <div v-else-if="!loading" class="p-6 text-center">
              <p class="text-gray-600 text-sm">{{ $t('newsPage.noArticles') }}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../utils/axios'
import DOMPurify from 'dompurify'
import ImagePlaceholder from '../components/ImagePlaceholder.vue'

const route = useRoute()
const allArticles = ref([])
const loading = ref(true)
const error = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(1)
const activeArticleId = ref(null)

const totalArticles = computed(() => allArticles.value.length)
const totalPages = computed(() => Math.ceil(totalArticles.value / itemsPerPage.value))

const displayedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  const articles = allArticles.value.slice(start, end)
  if (articles.length > 0) {
    activeArticleId.value = articles[0].id
  }
  return articles
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

const sanitizedContent = (article) => {
  if (!article || !article.content) return ''
  return DOMPurify.sanitize(article.content)
}

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

const formatDateLong = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const scrollToArticle = (articleId) => {
  const element = document.getElementById(`article-${articleId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  // Update current page to show the article
  const index = allArticles.value.findIndex(a => a.id === articleId)
  if (index !== -1) {
    currentPage.value = Math.floor(index / itemsPerPage.value) + 1
  }
}

const isCurrentArticle = (articleId) => {
  return activeArticleId.value === articleId
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  await fetchNews()
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
