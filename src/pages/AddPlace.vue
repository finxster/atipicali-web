<template>
  <div>
  <!-- Render the AddPlace form inline inside the page -->
  <div class="py-8">
    <AddPlaceForm :showCloseButton="false" @success="onSuccess" @cancel="onClose" />
  </div>

    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import AddPlaceForm from './AddPlaceForm.vue'

const router = useRouter()
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
</script>
