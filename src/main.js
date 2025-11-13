import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { setupAnalytics } from './plugins/analytics'
import './index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize Google Analytics 4
// This will automatically track pageviews and enable custom event tracking
// Only enabled in production (disabled on localhost and development)
setupAnalytics(app, router)

app.mount('#app')
