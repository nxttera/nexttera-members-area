<script setup lang="ts">
definePageMeta({
  title: 'Bem-vindo',
  middleware: 'auth'
})

const user = useSupabaseUser()
const { userProfile, updateUserProfile, isLoading } = useUserProfile()

// Se o usuário já completou o onboarding, redireciona para brand-positioning
watch(
  userProfile,
  profile => {
    if (profile?.onboarding_completed) {
      navigateTo('/brand-positioning')
    }
  },
  { immediate: true }
)

const currentStep = ref(1)
const totalSteps = 3
const errorMessage = ref('')

const formData = ref({
  name: '',
  company: '',
  phone: ''
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const completeOnboarding = async () => {
  try {
    errorMessage.value = ''

    console.log('Iniciando onboarding...', formData.value)

    // Atualiza os dados do perfil primeiro
    const profileUpdate = await updateUserProfile(formData.value)
    console.log('Perfil atualizado:', profileUpdate)

    // Marca o onboarding como completo
    const onboardingComplete = await $fetch('/api/user/profile', {
      method: 'PUT',
      body: { onboarding_completed: true }
    })
    console.log('Onboarding marcado como completo:', onboardingComplete)

    // Aguarda um pouco para garantir que a atualização foi processada
    await new Promise(resolve => setTimeout(resolve, 500))

    // Redireciona para o brand-positioning
    console.log('Redirecionando para brand-positioning...')
    await navigateTo('/brand-positioning')
  } catch (error: any) {
    console.error('Erro ao completar onboarding:', error)
    errorMessage.value = error.message || 'Erro ao salvar dados. Tente novamente.'
  }
}

// Função para formatar telefone brasileiro
const formatPhone = (value: string) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')

  // Aplica a máscara (11) 99999-9999
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
  }
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPhone(target.value)
  formData.value.phone = formatted
  target.value = formatted
}

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps) * 100
})

onMounted(() => {
  if (userProfile.value?.name) {
    formData.value.name = userProfile.value.name
  }
  if (userProfile.value?.company) {
    formData.value.company = userProfile.value.company
  }
  if (userProfile.value?.phone) {
    formData.value.phone = userProfile.value.phone
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-2xl">
      <div class="bg-white shadow-xl rounded-lg">
        <div class="px-8 py-10">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">🎉 Bem-vindo a Nexttera!</h1>
            <p class="text-gray-600 text-lg">Vamos configurar sua conta em poucos passos</p>
          </div>

          <!-- Progress Bar -->
          <div class="mb-8">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Passo {{ currentStep }} de {{ totalSteps }}</span>
              <span>{{ Math.round(progressPercentage) }}% completo</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>
          </div>

          <!-- Step 1: Welcome & Name -->
          <div v-if="currentStep === 1" class="space-y-8">
            <div class="text-center">
              <div class="text-6xl mb-4">👋</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">
                Olá! Como você gostaria de ser chamado?
              </h2>
              <p class="text-gray-600 mb-6">Seu nome nos ajuda a personalizar sua experiência</p>
            </div>

            <div class="space-y-2">
              <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                Nome completo
              </label>
              <div class="mt-2">
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="Digite seu nome completo"
                  class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button
                type="button"
                class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!formData.name.trim()"
                @click="nextStep"
              >
                Continuar
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <!-- Step 2: Company Info -->
          <div v-if="currentStep === 2" class="space-y-8">
            <div class="text-center">
              <div class="text-6xl mb-4">🏢</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Conte-nos sobre sua empresa</h2>
              <p class="text-gray-600 mb-6">
                Essas informações nos ajudam a personalizar as funcionalidades
              </p>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label for="company" class="block text-sm font-medium leading-6 text-gray-900">
                  Nome da empresa
                </label>
                <div class="mt-2">
                  <input
                    id="company"
                    v-model="formData.company"
                    type="text"
                    name="company"
                    autocomplete="organization"
                    placeholder="Digite o nome da sua empresa"
                    class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">
                  Telefone
                  <span class="text-sm text-gray-500 font-normal">(opcional)</span>
                </label>
                <div class="mt-2">
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    name="phone"
                    autocomplete="tel"
                    placeholder="(11) 99999-9999"
                    maxlength="15"
                    class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    @input="handlePhoneInput"
                  />
                </div>
              </div>
            </div>

            <div class="flex justify-between pt-4">
              <button
                type="button"
                class="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                @click="prevStep"
              >
                <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                Voltar
              </button>
              <button
                type="button"
                class="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="nextStep"
              >
                Continuar
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <!-- Step 3: Ready to Start -->
          <div v-if="currentStep === 3" class="space-y-8">
            <div class="text-center">
              <div class="text-6xl mb-4">🚀</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Tudo pronto!</h2>
              <p class="text-gray-600 mb-6">
                Sua conta foi configurada com sucesso. Agora você pode explorar todas as
                funcionalidades da plataforma.
              </p>
            </div>

            <!-- Summary -->
            <div class="rounded-lg bg-gray-50 p-6 border border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo da sua conta:</h3>
              <dl class="space-y-3">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600">Nome:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ formData.name }}</dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600">Email:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ user?.email }}</dd>
                </div>
                <div v-if="formData.company" class="flex justify-between">
                  <dt class="text-sm text-gray-600">Empresa:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ formData.company }}</dd>
                </div>
                <div v-if="formData.phone" class="flex justify-between">
                  <dt class="text-sm text-gray-600">Telefone:</dt>
                  <dd class="text-sm font-medium text-gray-900">{{ formData.phone }}</dd>
                </div>
              </dl>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 border border-red-200">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ errorMessage }}</p>
                </div>
              </div>
            </div>

            <div class="flex justify-between pt-4">
              <button
                type="button"
                class="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                @click="prevStep"
              >
                <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                Voltar
              </button>
              <button
                type="button"
                class="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading"
                @click="completeOnboarding"
              >
                <span v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4">
                  <svg
                    class="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                <template v-else>
                  Começar a usar
                  <Icon name="heroicons:rocket-launch" class="w-4 h-4 ml-2" />
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
