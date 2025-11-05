<template>
  <div
    :class="[
      'flex items-center justify-center overflow-hidden',
      `bg-gradient-to-br ${colorClass}`,
      sizeClass
    ]"
  >
    <svg class="text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" :class="iconSizeClass">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'large', // 'small', 'medium', 'large', 'xlarge'
    validator: (value) => ['small', 'medium', 'large', 'xlarge'].includes(value)
  }
})

const colors = [
  { gradient: 'from-blue-200 to-blue-300', name: 'blue' },
  { gradient: 'from-green-200 to-green-300', name: 'green' },
  { gradient: 'from-yellow-100 to-yellow-200', name: 'yellow' },
  { gradient: 'from-orange-200 to-red-300', name: 'red' }
]

const selectedColorIndex = ref(0)

onMounted(() => {
  // Pick a random color on mount
  selectedColorIndex.value = Math.floor(Math.random() * colors.length)
})

const colorClass = computed(() => {
  return colors[selectedColorIndex.value].gradient
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-24 h-24'
    case 'medium':
      return 'w-32 h-32'
    case 'large':
      return 'w-full h-96'
    case 'xlarge':
      return 'w-full h-64'
    default:
      return 'w-full h-96'
  }
})

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-8 h-8'
    case 'medium':
      return 'w-12 h-12'
    case 'large':
      return 'w-24 h-24'
    case 'xlarge':
      return 'w-16 h-16'
    default:
      return 'w-24 h-24'
  }
})
</script>
