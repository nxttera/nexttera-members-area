<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface FormButtonProps {
  name: string
  buttonLabel: string
  buttonClass?: string
  variant?: ButtonVariant
  size?: ButtonSize
  submits?: boolean
  full?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  loadingText?: string
}

interface FormButtonEmits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<FormButtonProps>(), {
  variant: 'primary',
  size: 'md',
  submits: false,
  full: false,
  loading: false,
  disabled: false,
  iconPosition: 'left',
  type: 'button'
})

const emit = defineEmits<FormButtonEmits>()

const buttonType = computed(() => (props.submits ? 'submit' : props.type))

const isButtonDisabled = computed(() => props.disabled || props.loading)

const displayLabel = computed(() => {
  if (props.loading && props.loadingText) {
    return props.loadingText
  }
  return props.buttonLabel
})

const iconName = computed(() => {
  if (props.loading) return 'heroicons:arrow-path'
  return props.icon
})

const shouldShowIcon = computed(() => iconName.value && !props.loading)
const shouldShowSpinner = computed(() => props.loading)

const variantClasses = computed(() => ({
  'btn-primary': props.variant === 'primary',
  'btn-secondary': props.variant === 'secondary',
  'btn-accent': props.variant === 'accent',
  'btn-neutral': props.variant === 'neutral',
  'btn-ghost': props.variant === 'ghost',
  'btn-link': props.variant === 'link'
}))

const sizeClasses = computed(() => ({
  'btn-xs': props.size === 'xs',
  'btn-sm': props.size === 'sm',
  'btn-lg': props.size === 'lg'
}))

const stateClasses = computed(() => ({
  'w-full': props.full,
  loading: props.loading,
  'btn-disabled': isButtonDisabled.value,
  'opacity-70': props.loading,
  'cursor-not-allowed': isButtonDisabled.value
}))

const baseClasses = computed(() => [
  'btn',
  'transition-all duration-200 ease-out',
  'shadow-md hover:shadow-lg',
  'active:scale-95',
  'font-semibold tracking-wide',
  'relative overflow-hidden',
  variantClasses.value,
  sizeClasses.value,
  stateClasses.value,
  props.buttonClass
])

const labelClasses = computed(() => ({
  'opacity-0': props.loading && !displayLabel.value
}))

const handleClick = (event: MouseEvent): void => {
  if (isButtonDisabled.value) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const renderLeftIcon = computed(() => props.iconPosition === 'left')
const renderRightIcon = computed(() => props.iconPosition === 'right')
</script>

<template>
  <button
    :name="props.name"
    :type="buttonType"
    :disabled="isButtonDisabled"
    :class="baseClasses"
    @click="handleClick"
  >
    <template v-if="renderLeftIcon">
      <span v-if="shouldShowSpinner" class="loading loading-spinner loading-sm" />
      <Icon
        v-else-if="shouldShowIcon"
        :name="iconName!"
        class="w-4 h-4 transition-transform duration-200"
      />
    </template>

    <span :class="labelClasses">
      {{ displayLabel }}
    </span>

    <template v-if="renderRightIcon">
      <span v-if="shouldShowSpinner" class="loading loading-spinner loading-sm" />
      <Icon
        v-else-if="shouldShowIcon"
        :name="iconName!"
        class="w-4 h-4 transition-transform duration-200"
      />
    </template>
  </button>
</template>
