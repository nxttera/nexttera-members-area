<script setup lang="ts">
type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
type ValidationRule = 'required' | 'email' | 'min' | 'max' | 'pattern' | 'cpf' | 'cnpj' | 'phone'
type MaskType = 'cpf' | 'cnpj' | 'phone' | 'cep' | 'currency' | 'credit-card' | 'date' | 'time'

interface FormInputProps {
  name: string
  inputType?: InputType
  label?: string
  placeholder?: string
  fieldName?: string
  rules?: ValidationRule[]
  min?: number
  max?: number
  pattern?: string
  mask?: MaskType
  maskPattern?: string
  floating?: boolean
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  class?: string
  inputClass?: string
  modelValue?: string
}

interface FormInputEmits {
  'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<FormInputProps>(), {
  inputType: 'text',
  rules: () => [],
  floating: true,
  disabled: false,
  readonly: false,
  modelValue: ''
})

const emit = defineEmits<FormInputEmits>()

const inputValue = ref(props.modelValue)
const isFocused = ref(false)
const validationErrors = ref<string[]>([])

const inputId = computed(() => `input-${props.name}`)
const isRequired = computed(() => props.rules.includes('required'))
const hasValue = computed(() => inputValue.value.length > 0)
const shouldFloatLabel = computed(() => props.floating && (isFocused.value || hasValue.value))
const hasError = computed(() => validationErrors.value.length > 0)
const errorMessage = computed(() => validationErrors.value[0] || '')

const predefinedMasks = computed(() => ({
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  phone: '(00) 00000-0000',
  cep: '00000-000',
  currency: 'R$ 0.000,00',
  'credit-card': '0000 0000 0000 0000',
  date: '00/00/0000',
  time: '00:00'
}))

const validationRules = computed(() => ({
  required: (): string | null => {
    if (!inputValue.value.trim()) {
      return `${props.fieldName || props.label} é obrigatório`
    }
    return null
  },

  email: (): string | null => {
    if (!inputValue.value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inputValue.value)) {
      return 'E-mail deve ter formato válido'
    }
    return null
  },

  min: (): string | null => {
    if (!props.min || !inputValue.value) return null
    if (inputValue.value.length < props.min) {
      return `Mínimo de ${props.min} caracteres`
    }
    return null
  },

  max: (): string | null => {
    if (!props.max || !inputValue.value) return null
    if (inputValue.value.length > props.max) {
      return `Máximo de ${props.max} caracteres`
    }
    return null
  },

  pattern: (): string | null => {
    if (!props.pattern || !inputValue.value) return null
    const regex = new RegExp(props.pattern)
    if (!regex.test(inputValue.value)) {
      return 'Formato inválido'
    }
    return null
  },

  cpf: (): string | null => {
    if (!inputValue.value) return null
    const cleanCpf = inputValue.value.replace(/\D/g, '')
    if (cleanCpf.length !== 11) {
      return 'CPF deve ter 11 dígitos'
    }
    if (!isValidCpf(cleanCpf)) {
      return 'CPF inválido'
    }
    return null
  },

  cnpj: (): string | null => {
    if (!inputValue.value) return null
    const cleanCnpj = inputValue.value.replace(/\D/g, '')
    if (cleanCnpj.length !== 14) {
      return 'CNPJ deve ter 14 dígitos'
    }
    if (!isValidCnpj(cleanCnpj)) {
      return 'CNPJ inválido'
    }
    return null
  },

  phone: (): string | null => {
    if (!inputValue.value) return null
    const cleanPhone = inputValue.value.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return 'Telefone deve ter 10 ou 11 dígitos'
    }
    return null
  }
}))

const currentMask = computed((): string => {
  if (props.maskPattern) {
    return props.maskPattern
  }
  if (props.mask) {
    return predefinedMasks.value[props.mask] || ''
  }
  return ''
})

const maskedValue = computed((): string => {
  if (!currentMask.value || !inputValue.value) return inputValue.value
  return applyMask(inputValue.value, currentMask.value)
})

const inputClasses = computed(() => [
  'input input-bordered w-full transition-all duration-200',
  'bg-base-200/50 backdrop-blur-sm',
  'border-2 focus:border-primary focus:outline-none',
  'hover:border-primary/60',
  'placeholder:text-base-content/40',
  {
    'input-error border-error': hasError.value,
    'cursor-not-allowed opacity-60': props.disabled
  },
  props.inputClass
])

const labelClasses = computed(() => {
  if (!props.floating) {
    return [
      'label-text font-medium text-base-content mb-2',
      {
        'text-error': hasError.value
      }
    ]
  }

  return [
    'absolute left-3 transition-all duration-200 pointer-events-none',
    'text-base-content/70',
    {
      'top-2 text-xs text-primary': shouldFloatLabel.value,
      'top-1/2 -translate-y-1/2 text-sm': !shouldFloatLabel.value,
      'text-error': hasError.value
    }
  ]
})

const applyMask = (value: string, mask: string): string => {
  if (!mask) return value

  const cleanValue = value.replace(/\D/g, '')
  let maskedValue = ''
  let valueIndex = 0

  for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
    if (mask[i] === '0') {
      maskedValue += cleanValue[valueIndex]
      valueIndex++
    } else {
      maskedValue += mask[i]
    }
  }

  return maskedValue
}

const isValidCpf = (cpf: string): boolean => {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0

  return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2
}

const isValidCnpj = (cnpj: string): boolean => {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weights1[i]
  }
  let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weights2[i]
  }
  let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2
}

const validateInput = (): boolean => {
  validationErrors.value = []

  for (const rule of props.rules) {
    const validation = validationRules.value[rule]
    if (validation) {
      const error = validation()
      if (error) {
        validationErrors.value.push(error)
      }
    }
  }

  return validationErrors.value.length === 0
}

const handleFocus = (): void => {
  isFocused.value = true
}

const handleBlur = (): void => {
  isFocused.value = false
  validateInput()
}

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const rawValue = target.value

  if (currentMask.value) {
    const cleanValue = rawValue.replace(/\D/g, '')
    inputValue.value = cleanValue
    target.value = applyMask(cleanValue, currentMask.value)
  } else {
    inputValue.value = rawValue
  }

  emit('update:modelValue', inputValue.value)

  if (validationErrors.value.length > 0) {
    validateInput()
  }
}

const forceValidation = (): boolean => {
  return validateInput()
}

watch(
  () => props.modelValue,
  newValue => {
    inputValue.value = newValue || ''
  }
)

defineExpose({
  validate: validateInput,
  forceValidation,
  hasError: readonly(hasError),
  errorMessage: readonly(errorMessage),
  validationErrors: readonly(validationErrors),
  value: readonly(inputValue)
})
</script>

<template>
  <div :class="['form-control w-full', $props.class]" data-form-input>
    <label v-if="props.label && !props.floating" :for="inputId" :class="labelClasses">
      {{ props.label }}
      <span v-if="isRequired" class="text-error ml-1">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :name="props.name"
        :type="props.inputType"
        :placeholder="props.floating ? ' ' : props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :autocomplete="props.autocomplete"
        :required="isRequired"
        :class="inputClasses"
        :value="maskedValue"
        novalidate
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <label v-if="props.label && props.floating" :for="inputId" :class="labelClasses">
        {{ props.label }}
        <span v-if="isRequired" class="text-error ml-1">*</span>
      </label>
    </div>

    <div v-if="hasError" class="label">
      <span class="label-text-alt text-error flex items-center gap-1">
        <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
        {{ errorMessage }}
      </span>

      <div v-if="validationErrors.length > 1" class="mt-1 space-y-1">
        <div
          v-for="(error, index) in validationErrors.slice(1)"
          :key="index"
          class="label-text-alt text-error text-xs opacity-75"
        >
          • {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
