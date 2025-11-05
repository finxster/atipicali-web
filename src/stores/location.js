import { ref, computed } from 'vue'

// Store for managing selected location across app
const selectedLocation = ref(null)

export const useLocationStore = () => {
  const setLocation = (location) => {
    selectedLocation.value = location
  }

  const clearLocation = () => {
    selectedLocation.value = null
  }

  const getLocation = computed(() => selectedLocation.value)

  return {
    selectedLocation,
    setLocation,
    clearLocation,
    getLocation
  }
}
