<template>
  <template v-if="!inline">
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        leave-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div v-if="isOpen" :class="overlayClass" @click.self="closeModal">
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in"
            enter-from-class="opacity-0 translate-y-2 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-95"
          >
            <div v-if="isOpen" :class="containerClass">
              <AddPlaceForm @success="onSuccess" @cancel="closeModal" />
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </template>

  <template v-else>
    <div :class="inlineWrapperClass">
      <div :class="containerClass">
        <AddPlaceForm @success="onSuccess" @cancel="closeModal" />
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, watch } from 'vue'
import AddPlaceForm from '@/pages/AddPlaceForm.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  inline: {
    type: Boolean,
    required: false,
    default: false
  },
  fullscreen: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const closeModal = () => {
  emit('close')
}

const onSuccess = (payload) => {
  emit('success', payload)
  // close modal after success
  emit('close')
}

const overlayClass = computed(() => {
  if (props.fullscreen) return 'fixed inset-0 z-50 bg-white overflow-auto'
  return 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
})

const containerClass = computed(() => {
  if (props.fullscreen) return 'bg-white w-full min-h-screen h-full overflow-auto flex flex-col'
  // for inline rendering, make it full width but constrained
  if (props.inline) return 'bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden flex flex-col'
  return 'bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'
})

const inlineWrapperClass = computed(() => {
  return props.inline ? 'w-full py-8' : ''
})

// handle Escape key to close modal when teleported modal is open
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})
</script>