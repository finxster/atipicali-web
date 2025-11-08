<template>
  <div>
    <!-- Render the AddPlace form inline inside the page -->
    <div class="py-8">
      <AddPlaceForm :showCloseButton="false" @success="onSuccess" @cancel="onClose" />
    </div>

    <Footer />
    
    <!-- Auth Modal for Add Place -->
    <AuthModal
      :isOpen="showAuthModal"
      initialMode="login"
      :message="$t('auth.loginForAddPlace')"
      @close="showAuthModal = false"
      @success="onAuthSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Footer from '../components/Footer.vue'
import AddPlaceForm from './AddPlaceForm.vue'
import AuthModal from '../components/AuthModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const showAuthModal = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Check authentication on component load
if (!isAuthenticated.value) {
  showAuthModal.value = true
}

const onClose = () => {
  // navigate back to home when canceled
  router.push('/')
}

const onSuccess = (createdPlace) => {
  // redirect to submission confirmation page
  if (createdPlace && createdPlace.id) {
    router.push({ name: 'PlaceSubmitted', params: { id: createdPlace.id } })
  } else {
    router.push('/')
  }
}

const onAuthSuccess = () => {
  showAuthModal.value = false
}
</script>
