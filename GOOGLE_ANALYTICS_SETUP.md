# Google Analytics 4 Implementation Guide

## Overview
This document explains the Google Analytics 4 (GA4) implementation in the AtipicALI Vue application. The implementation is production-ready, follows best practices, and includes automatic pageview tracking and custom event capabilities.

## 📁 Files Created/Modified

### New Files
1. **`.env.example`** - Environment variable template
2. **`src/plugins/analytics.js`** - GA4 configuration plugin
3. **`src/composables/useAnalytics.js`** - Custom event tracking composable

### Modified Files
1. **`src/main.js`** - Added GA4 initialization
2. **`package.json`** - Added vue-gtag-next dependency

## 🚀 Setup Instructions

### Step 1: Install Dependencies (Already Done)
```bash
npm install vue-gtag-next
```

### Step 2: Configure Environment Variables
1. Create a `.env` file in the project root (it's already in .gitignore)
2. Add your GA4 Measurement ID:
```env
VITE_GA_MEASUREMENT_ID=G-YOUR-ACTUAL-ID-HERE
```

**To get your Measurement ID:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (or use existing)
3. Go to Admin → Data Streams → Your Web Stream
4. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 3: Start Development
The analytics are automatically configured! They will:
- ✅ **Disable** tracking on localhost/development
- ✅ **Enable** tracking in production only
- ✅ Track pageviews automatically on route changes
- ✅ Log events to console in development for debugging

## 📊 Features

### 1. Automatic Pageview Tracking
Every route change is automatically tracked. No additional code needed!

### 2. Development-Friendly
- Analytics disabled on localhost
- Console logging in development mode
- No data pollution in GA during development

### 3. Privacy-Compliant
- IP anonymization enabled
- Secure cookie settings
- GDPR-friendly configuration

### 4. Custom Event Tracking
Use the `useAnalytics` composable anywhere in your Vue components.

## 🎯 Usage Examples

### Basic Event Tracking
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackEvent } = useAnalytics()

// Track a button click
const handleSubscribe = () => {
  trackEvent('button_click', { 
    button_name: 'subscribe',
    page: 'home' 
  })
  // ... rest of your code
}

// Track a search
const handleSearch = (searchTerm) => {
  trackEvent('search', { 
    search_term: searchTerm,
    results_count: results.length 
  })
}
</script>

<template>
  <button @click="handleSubscribe">Subscribe</button>
</template>
```

### Track Content Views
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'
import { onMounted } from 'vue'

const { trackEvent } = useAnalytics()

onMounted(() => {
  trackEvent('place_view', {
    place_id: props.placeId,
    place_name: place.value.name,
    place_category: place.value.category
  })
})
</script>
```

### Track Form Submissions
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackEvent } = useAnalytics()

const submitForm = async () => {
  try {
    await api.submitPlace(formData)
    
    trackEvent('place_submission', {
      category: formData.category,
      has_rating: !!formData.rating,
      has_comment: !!formData.comment
    })
    
    router.push('/success')
  } catch (error) {
    // Track errors too
    trackError('form_submission_error', error.message)
  }
}
</script>
```

### Track User Interactions
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackInteraction } = useAnalytics()

// Track interactions with a specific format
const handleShare = () => {
  trackInteraction('click', 'social', 'share_button')
}

const handleDownload = () => {
  trackInteraction('download', 'content', 'place_info_pdf')
}
</script>
```

### Track Social Sharing
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackSocial } = useAnalytics()

const shareOnFacebook = () => {
  trackSocial('facebook', 'share', window.location.href)
  // ... open share dialog
}

const shareOnTwitter = () => {
  trackSocial('twitter', 'tweet', window.location.href)
  // ... open tweet dialog
}
</script>
```

### Track Errors
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackError } = useAnalytics()

const fetchData = async () => {
  try {
    const data = await api.getPlaces()
    return data
  } catch (error) {
    trackError('api_error', `Failed to fetch places: ${error.message}`, false)
    throw error
  }
}
</script>
```

### Track Performance Metrics
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'
import { onMounted } from 'vue'

const { trackTiming } = useAnalytics()

onMounted(() => {
  const startTime = performance.now()
  
  // Load data
  loadHeavyData().then(() => {
    const loadTime = performance.now() - startTime
    trackTiming('data_load', Math.round(loadTime), 'API')
  })
})
</script>
```

### Track User Authentication
```vue
<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackEvent, setUserId, setUserProperties } = useAnalytics()

const handleLogin = async (credentials) => {
  const user = await api.login(credentials)
  
  // Set user ID for cross-device tracking
  setUserId(user.id)
  
  // Set user properties for segmentation
  setUserProperties({
    user_type: user.isPremium ? 'premium' : 'free',
    signup_date: user.createdAt,
    preferred_language: user.language
  })
  
  // Track login event
  trackEvent('login', {
    method: 'email',
    user_type: user.isPremium ? 'premium' : 'free'
  })
}
</script>
```

## 🔧 Available Methods

### `trackEvent(eventName, eventParams)`
Track custom events with parameters.

### `trackPageView(pageTitle, pagePath, additionalParams)`
Manually track page views (usually automatic).

### `trackInteraction(action, category, label, value)`
Track user interactions in a standardized format.

### `trackError(errorType, description, fatal)`
Track errors and exceptions.

### `trackTiming(name, value, category)`
Track performance and timing metrics.

### `trackSocial(network, action, target)`
Track social media interactions.

### `trackConversion(action, params)`
Track conversion events (e.g., signups, purchases).

### `setUserProperties(properties)`
Set user properties for segmentation.

### `setUserId(userId)`
Set user ID for cross-device tracking.

### `isEnabled()`
Check if analytics is currently enabled.

## 🧪 Testing the Implementation

### In Development (Localhost)
```bash
npm run dev
```
- Open browser console
- Navigate between pages
- You should see: `📊 Analytics (dev) - Page View: [title] [path]`
- Events will be logged but NOT sent to GA

### In Production
```bash
npm run build
npm run preview
```
- Or deploy to production
- Open browser console
- You should see: `📊 Google Analytics: Enabled with ID: G-XXXXXXXXXX`
- Check GA4 Real-time reports to see events

### Verify in Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Go to **Reports → Realtime**
4. Visit your site and navigate around
5. You should see:
   - Active users
   - Page views
   - Custom events (if you've added tracking)

## 🔒 Privacy & GDPR Compliance

The implementation includes privacy-friendly settings:
- ✅ IP anonymization enabled
- ✅ Secure cookie settings
- ✅ 2-year cookie expiration
- ✅ SameSite cookie policy

**Note:** Depending on your region and requirements, you may need to:
1. Add a cookie consent banner
2. Delay GA initialization until consent is given
3. Provide opt-out mechanisms

## 🐛 Troubleshooting

### GA4 Not Tracking in Production
1. Verify `.env` has the correct Measurement ID
2. Check browser console for initialization message
3. Ensure you're not on localhost
4. Check GA4 Real-time reports (can take a few seconds)

### Events Not Showing
1. Wait up to 24 hours for data to appear in standard reports
2. Check Real-time reports for immediate feedback
3. Verify event naming (use lowercase with underscores)
4. Check browser console for errors

### Analytics Disabled Message
This is expected in development! GA4 only tracks in production to avoid polluting your analytics data.

## 📚 Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [vue-gtag-next GitHub](https://github.com/MatteoGabriele/vue-gtag-next)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

## 🎉 You're All Set!

Your GA4 implementation is complete and production-ready. Just add your Measurement ID and start tracking!
