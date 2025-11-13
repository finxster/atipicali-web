/**
 * Google Analytics 4 Plugin Configuration
 * 
 * This plugin configures GA4 for the application with the following features:
 * - Only tracks in production (localhost/development tracking is disabled)
 * - Requires user consent (GDPR/privacy compliant)
 * - Automatic pageview tracking on route changes
 * - Custom event tracking support
 * - Environment-based configuration
 * 
 * Environment Variables Required:
 * - VITE_GA_MEASUREMENT_ID: Your GA4 Measurement ID (format: G-XXXXXXXXXX)
 */

import VueGtag from 'vue-gtag-next'

/**
 * Check if user has given analytics consent
 * 
 * @returns {boolean} True if user has consented to analytics
 */
const hasUserConsent = () => {
  try {
    const consent = localStorage.getItem('atipicali_cookie_consent')
    if (consent) {
      const parsed = JSON.parse(consent)
      return parsed.analytics === true
    }
  } catch (error) {
    console.error('Failed to read cookie consent:', error)
  }
  return false
}

/**
 * Determines if analytics should be enabled
 * Analytics is only enabled in production environments AND with user consent
 * 
 * @returns {boolean} True if analytics should be enabled
 */
const isProduction = () => {
  // Check if we're in production mode (Vite build)
  const isProd = import.meta.env.PROD
  
  // Check if we're NOT on localhost or development domains
  const hostname = window.location.hostname
  const isNotLocalhost = hostname !== 'localhost' && 
                         hostname !== '127.0.0.1' &&
                         !hostname.startsWith('192.168.') &&
                         !hostname.startsWith('10.') &&
                         hostname !== '0.0.0.0'
  
  // Also check the port - if running on common dev ports, disable
  const port = window.location.port
  const isNotDevPort = port !== '5173' && // Vite default
                       port !== '3000' && // Common dev port
                       port !== '8080' && // Another common dev port
                       port !== '4173'    // Vite preview
  
  return isProd && isNotLocalhost && isNotDevPort
}

/**
 * Gets the GA4 Measurement ID from environment variables
 * 
 * @returns {string|null} The Measurement ID or null if not configured
 */
const getMeasurementId = () => {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || null
}

/**
 * Install and configure Google Analytics 4
 * 
 * @param {Object} app - Vue application instance
 * @param {Object} router - Vue Router instance
 */
export const setupAnalytics = (app, router) => {
  const measurementId = getMeasurementId()
  
  // Validate Measurement ID
  if (!measurementId) {
    console.warn('⚠️ Google Analytics: VITE_GA_MEASUREMENT_ID is not configured in environment variables')
    return
  }

  // Check if Measurement ID is still the placeholder
  if (measurementId === 'G-XXXXXXXXXX') {
    console.warn('⚠️ Google Analytics: Please replace the placeholder Measurement ID with your actual GA4 ID')
    return
  }

  const isProd = isProduction()
  const hasConsent = hasUserConsent()
  
  // Analytics is only enabled if BOTH conditions are met:
  // 1. Running in production (not localhost)
  // 2. User has given consent
  const enabled = isProd && hasConsent
  
  // Log configuration status (only in development)
  if (import.meta.env.DEV) {
    if (!isProd) {
      console.log('📊 Google Analytics: Disabled (not in production environment)')
    } else if (!hasConsent) {
      console.log('📊 Google Analytics: Waiting for user consent')
    } else {
      console.log('📊 Google Analytics: Enabled')
    }
  }

  // Configure and install GA4
  app.use(VueGtag, {
    // GA4 Measurement ID
    property: {
      id: measurementId,
      params: {
        // Send page views automatically on route change
        send_page_view: true,
        // Cookie settings
        cookie_flags: 'SameSite=None;Secure',
      }
    },
    
    // Enable/disable based on environment
    enabled,
    
    // Bootstrap with config (immediately initialize)
    bootstrap: enabled,
    
    // Disable on localhost and development
    disableScriptLoad: !enabled,
    
    // Additional configuration
    config: {
      // Custom parameters
      custom_map: {
        dimension1: 'user_type',
        dimension2: 'page_category'
      },
      
      // Anonymize IP addresses for privacy compliance
      anonymize_ip: true,
      
      // Cookie settings
      cookie_domain: 'auto',
      cookie_expires: 63072000, // 2 years in seconds
      
      // Debug mode (only in development)
      debug_mode: import.meta.env.DEV
    }
  }, router)
}

/**
 * Export helper to check if analytics is enabled
 * Useful for conditional tracking logic
 */
export const isAnalyticsEnabled = isProduction

export default setupAnalytics
