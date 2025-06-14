<script setup lang="ts">
interface FormBaseProps {
  class?: string
  loading?: boolean
  disabled?: boolean
}

interface FormBaseEmits {
  submit: [event: Event, payload: FormData]
}

const props = withDefaults(defineProps<FormBaseProps>(), {
  loading: false,
  disabled: false
})

const emit = defineEmits<FormBaseEmits>()

const formRef = ref<HTMLFormElement>()
const isSubmitting = ref(false)
const inputRefs = ref<any[]>([])

const isFormDisabled = computed(() => props.disabled || props.loading || isSubmitting.value)

const formClasses = computed(() => [
  'flex flex-col gap-4',
  'transition-all duration-300 ease-out',
  {
    'opacity-60 pointer-events-none': isFormDisabled.value,
    'animate-pulse': props.loading
  },
  props.class
])

const handleSubmit = async (event: Event): Promise<void> => {
  event.preventDefault()

  if (!formRef.value || isFormDisabled.value) return

  const isFormValid = validateAllInputs()
  if (!isFormValid) return

  isSubmitting.value = true

  try {
    const formData = new FormData(formRef.value)
    await emit('submit', event, formData)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = (): void => {
  if (formRef.value) {
    formRef.value.reset()
  }
}

const getFormData = (): FormData | null => {
  if (!formRef.value) return null
  return new FormData(formRef.value)
}

const validateAllInputs = (): boolean => {
  if (!formRef.value) return false

  let isValid = true
  const inputs = formRef.value.querySelectorAll('input[required]')

  inputs.forEach(input => {
    const inputElement = input as HTMLInputElement
    const wrapper = inputElement.closest('[data-form-input]')

    if (wrapper) {
      const vueInstance = (wrapper as any).__vueParentComponent?.proxy
      if (vueInstance && typeof vueInstance.forceValidation === 'function') {
        const fieldValid = vueInstance.forceValidation()
        if (!fieldValid) {
          isValid = false
        }
      }
    }
  })

  return isValid
}

const validateForm = (): boolean => {
  return validateAllInputs()
}

defineExpose({
  isSubmitting: readonly(isSubmitting),
  isFormDisabled: readonly(isFormDisabled),
  formRef: readonly(formRef),
  resetForm,
  getFormData,
  validateForm
})
</script>

<template>
  <form ref="formRef" :class="formClasses" novalidate @submit="handleSubmit">
    <div
      v-if="props.loading"
      class="absolute inset-0 flex items-center justify-center bg-base-100/50 backdrop-blur-sm rounded-xl z-10"
    >
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>
    <slot />
  </form>
</template>
