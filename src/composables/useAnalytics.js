/**
 * useAnalytics Composable
 * 
 * Provides a convenient interface for tracking custom events in Google Analytics 4
 * 
 * Usage Example:
 * 
 * import { useAnalytics } from '@/composables/useAnalytics'
 * 
 * const { trackEvent, trackPageView, trackError, trackTiming } = useAnalytics()
 * 
 * // Track a custom event
 * trackEvent('button_click', { button_name: 'subscribe', page: 'home' })
 * 
 * // Track article/content views
 * trackEvent('article_view', { 
 *   article_id: '123', 
 *   article_title: 'My Article',
 *   category: 'news'
 * })
 * 
 * // Track errors
 * trackError('api_error', 'Failed to load data')
 * 
 * // Track page load timing
 * trackTiming('page_load', 1250, 'Home Page')
 */

import { inject } from 'vue'

export function useAnalytics() {
  // Access the gtag instance (will be undefined if GA is not enabled)
  const gtag = window.gtag

  /**
   * Check if analytics is available and enabled
   * @returns {boolean}
   */
  const isEnabled = () => {
    return typeof gtag === 'function'
  }

  /**
   * Track a custom event
   * 
   * @param {string} eventName - The name of the event (e.g., 'button_click', 'article_view')
   * @param {Object} eventParams - Additional parameters for the event
   * @param {string} eventParams.category - Event category (optional)
   * @param {string} eventParams.label - Event label (optional)
   * @param {number} eventParams.value - Event value (optional)
   * 
   * @example
   * trackEvent('search', { 
   *   search_term: 'neurodivergent friendly cafe',
   *   results_count: 5 
   * })
   */
  const trackEvent = (eventName, eventParams = {}) => {
    if (!isEnabled()) {
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev):', eventName, eventParams)
      }
      return
    }

    try {
      gtag('event', eventName, {
        ...eventParams,
        // Add timestamp
        event_timestamp: Date.now()
      })
      
      // Only log in development
      if (import.meta.env.DEV) {
        console.log('📊 GA Event:', eventName, eventParams)
      }
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  /**
   * Track a page view manually (useful for SPAs)
   * 
   * @param {string} pageTitle - Title of the page
   * @param {string} pagePath - Path of the page
   * @param {Object} additionalParams - Additional tracking parameters
   */
  const trackPageView = (pageTitle, pagePath, additionalParams = {}) => {
    if (!isEnabled()) {
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev) - Page View:', pageTitle, pagePath)
      }
      return
    }

    try {
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        page_location: window.location.href,
        ...additionalParams
      })
      
      if (import.meta.env.DEV) {
        console.log('📊 GA Page View:', pageTitle, pagePath)
      }
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  /**
   * Track user interactions
   * 
   * @param {string} action - The interaction action (e.g., 'click', 'submit', 'download')
   * @param {string} category - The interaction category
   * @param {string} label - The interaction label
   * @param {number} value - The interaction value (optional)
   */
  const trackInteraction = (action, category, label, value = null) => {
    const params = {
      event_category: category,
      event_label: label
    }
    
    if (value !== null) {
      params.value = value
    }
    
    trackEvent(action, params)
  }

  /**
   * Track errors and exceptions
   * 
   * @param {string} errorType - Type of error (e.g., 'api_error', 'validation_error')
   * @param {string} description - Error description
   * @param {boolean} fatal - Whether the error is fatal
   */
  const trackError = (errorType, description, fatal = false) => {
    if (!isEnabled()) {
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev) - Error:', errorType, description)
      }
      return
    }

    try {
      gtag('event', 'exception', {
        description: `${errorType}: ${description}`,
        fatal,
        error_type: errorType
      })
      
      if (import.meta.env.DEV) {
        console.log('📊 GA Error:', errorType, description)
      }
    } catch (error) {
      console.error('Failed to track error:', error)
    }
  }

  /**
   * Track timing/performance metrics
   * 
   * @param {string} name - Name of the timing metric
   * @param {number} value - Value in milliseconds
   * @param {string} category - Timing category (optional)
   */
  const trackTiming = (name, value, category = 'Performance') => {
    if (!isEnabled()) {
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev) - Timing:', name, value, 'ms')
      }
      return
    }

    try {
      gtag('event', 'timing_complete', {
        name,
        value,
        event_category: category
      })
      
      if (import.meta.env.DEV) {
        console.log('📊 GA Timing:', name, value, 'ms')
      }
    } catch (error) {
      console.error('Failed to track timing:', error)
    }
  }

  /**
   * Track social interactions
   * 
   * @param {string} network - Social network name (e.g., 'facebook', 'twitter')
   * @param {string} action - Social action (e.g., 'share', 'like', 'tweet')
   * @param {string} target - Target of the action
   */
  const trackSocial = (network, action, target) => {
    trackEvent('social_interaction', {
      social_network: network,
      social_action: action,
      social_target: target
    })
  }

  /**
   * Track e-commerce or conversion events
   * 
   * @param {string} action - Conversion action (e.g., 'add_to_cart', 'purchase', 'sign_up')
   * @param {Object} params - Conversion parameters
   */
  const trackConversion = (action, params = {}) => {
    trackEvent(action, {
      ...params,
      currency: params.currency || 'USD'
    })
  }

  /**
   * Set user properties (for user segmentation)
   * 
   * @param {Object} properties - User properties to set
   * 
   * @example
   * setUserProperties({ 
   *   user_type: 'premium',
   *   preferred_language: 'pt-BR' 
   * })
   */
  const setUserProperties = (properties) => {
    if (!isEnabled()) {
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev) - User Properties:', properties)
      }
      return
    }

    try {
      gtag('set', 'user_properties', properties)
      if (import.meta.env.DEV) {
        console.log('📊 GA User Properties:', properties)
      }
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  /**
   * Set user ID for cross-device tracking
   * 
   * @param {string} userId - Unique user identifier
   */
  const setUserId = (userId) => {
    if (!isEnabled()) {
      if (import.meta.env.DEV) {
        console.log('📊 Analytics (dev) - User ID:', userId)
      }
      return
    }

    try {
      gtag('set', { user_id: userId })
      if (import.meta.env.DEV) {
        console.log('📊 GA User ID set:', userId)
      }
    } catch (error) {
      console.error('Failed to set user ID:', error)
    }
  }

  return {
    // Main tracking functions
    trackEvent,
    trackPageView,
    trackInteraction,
    trackError,
    trackTiming,
    trackSocial,
    trackConversion,
    
    // User tracking
    setUserProperties,
    setUserId,
    
    // Utility
    isEnabled
  }
}

export default useAnalytics
