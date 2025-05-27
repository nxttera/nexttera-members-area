<script setup lang="ts">
interface ErrorPageProps {
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}

defineProps<ErrorPageProps>()

const errorMessages = {
  404: 'A página que você está procurando não foi encontrada.',
  500: 'Ocorreu um erro interno no servidor.',
  403: 'Você não tem permissão para acessar este recurso.',
  default: 'Algo deu errado. Tente novamente mais tarde.'
}

const getErrorMessage = (statusCode: number) => {
  return errorMessages[statusCode as keyof typeof errorMessages] || errorMessages.default
}

const getErrorIcon = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'heroicons:magnifying-glass'
    case 500:
      return 'heroicons:exclamation-triangle'
    case 403:
      return 'heroicons:lock-closed'
    default:
      return 'heroicons:exclamation-circle'
  }
}

const handleGoHome = () => {
  clearError({ redirect: '/' })
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleGoHome()
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center p-4">
    <div class="text-center max-w-2xl mx-auto">
      <div class="mb-8">
        <Icon :name="getErrorIcon(error.statusCode)" class="h-24 w-24 text-error mx-auto mb-4" />
        <div class="text-8xl font-bold text-error mb-2">
          {{ error.statusCode }}
        </div>
        <h1 class="text-3xl font-bold text-base-content mb-4">
          {{ error.statusMessage }}
        </h1>
        <p class="text-xl text-base-content/70 mb-8">
          {{ getErrorMessage(error.statusCode) }}
        </p>

        <div v-if="error.message" class="alert alert-error mb-8">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
          <span>{{ error.message }}</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="btn btn-outline btn-lg" @click="handleGoBack">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          Voltar
        </button>
        <button class="btn btn-primary btn-lg" @click="handleGoHome">
          <Icon name="heroicons:home" class="h-5 w-5" />
          Página Inicial
        </button>
      </div>

      <div class="mt-12 text-sm text-base-content/50">
        <p>Se o problema persistir, entre em contato com o suporte.</p>
      </div>
    </div>
  </div>
</template>
