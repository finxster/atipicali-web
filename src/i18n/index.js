import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pt from './locales/pt.json'

// Detect browser language and persist to localStorage
const savedLocale = localStorage.getItem('atipicali_locale')
const browserLocale = navigator.language.split('-')[0]
const defaultLocale = savedLocale || (browserLocale === 'pt' ? 'pt' : 'en')

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    pt
  }
})

// Save locale changes to localStorage
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('atipicali_locale', locale)
}

export default i18n
