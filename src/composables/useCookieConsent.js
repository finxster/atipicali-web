/**
 * Cookie Consent Composable
 * 
 * Manages cookie consent state for GDPR/privacy compliance.
 * Stores user's consent preferences in localStorage.
 * 
 * Usage:
 * import { useCookieConsent } from '@/composables/useCookieConsent'
 * 
 * const { hasConsent, showBanner, acceptAll, acceptNecessary, declineAll } = useCookieConsent()
 */

import { ref, computed } from 'vue'

const CONSENT_KEY = 'atipicali_cookie_consent'
const CONSENT_VERSION = '1.0' // Increment if you change cookie policies

// Shared state across all instances
const consentState = ref(null)
const bannerVisible = ref(false)

/**
 * Get stored consent from localStorage
 */
const getStoredConsent = () => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) {
      const consent = JSON.parse(stored)
      // Check if consent version matches
      if (consent.version === CONSENT_VERSION) {
        return consent
      }
    }
  } catch (error) {
    console.error('Failed to read cookie consent:', error)
  }
  return null
}

/**
 * Save consent to localStorage
 */
const saveConsent = (consent) => {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      ...consent,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Failed to save cookie consent:', error)
  }
}

/**
 * Initialize consent state
 */
const initializeConsent = () => {
  if (consentState.value === null) {
    const stored = getStoredConsent()
    if (stored) {
      consentState.value = stored
      bannerVisible.value = false
    } else {
      // No consent stored, show banner
      consentState.value = {
        necessary: true, // Always true (required for site to function)
        analytics: false,
        marketing: false
      }
      bannerVisible.value = true
    }
  }
}

export function useCookieConsent() {
  // Initialize on first use
  initializeConsent()

  /**
   * Check if user has given consent for analytics
   */
  const hasAnalyticsConsent = computed(() => {
    return consentState.value?.analytics === true
  })

  /**
   * Check if user has given any consent
   */
  const hasGivenConsent = computed(() => {
    return consentState.value !== null && 
           consentState.value.timestamp !== undefined
  })

  /**
   * Accept all cookies
   */
  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: false // Add marketing if needed
    }
    consentState.value = consent
    saveConsent(consent)
    bannerVisible.value = false
    
    // Reload page to initialize analytics
    window.location.reload()
  }

  /**
   * Accept only necessary cookies
   */
  const acceptNecessary = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    consentState.value = consent
    saveConsent(consent)
    bannerVisible.value = false
  }

  /**
   * Accept selected cookies (for granular control)
   */
  const acceptSelected = (preferences) => {
    const consent = {
      necessary: true, // Always required
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false
    }
    consentState.value = consent
    saveConsent(consent)
    bannerVisible.value = false
    
    // If analytics was just enabled, reload to initialize
    if (preferences.analytics) {
      window.location.reload()
    }
  }

  /**
   * Decline all optional cookies (keep only necessary)
   */
  const declineAll = () => {
    acceptNecessary()
  }

  /**
   * Revoke consent (for privacy settings page)
   */
  const revokeConsent = () => {
    localStorage.removeItem(CONSENT_KEY)
    consentState.value = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    bannerVisible.value = true
  }

  /**
   * Show banner again (for privacy settings)
   */
  const showConsentBanner = () => {
    bannerVisible.value = true
  }

  /**
   * Hide banner
   */
  const hideConsentBanner = () => {
    bannerVisible.value = false
  }

  return {
    // State
    consent: computed(() => consentState.value),
    hasAnalyticsConsent,
    hasGivenConsent,
    showBanner: computed(() => bannerVisible.value),
    
    // Actions
    acceptAll,
    acceptNecessary,
    acceptSelected,
    declineAll,
    revokeConsent,
    showConsentBanner,
    hideConsentBanner
  }
}

export default useCookieConsent
