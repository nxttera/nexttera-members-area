<script setup lang="ts">
import type { BrandPositioningSession } from '~/shared/types/brand-positioning'

definePageMeta({
  middleware: 'onboarding'
})

const user = useSupabaseUser()

const sessions = ref<BrandPositioningSession[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

const fetchSessions = async () => {
  try {
    isLoading.value = true
    const response = (await $fetch('/api/brand-positioning/sessions')) as any
    sessions.value = response.data || []
  } catch (error: any) {
    console.error('Erro ao buscar sessões:', error)
    errorMessage.value = 'Erro ao carregar suas jornadas'
  } finally {
    isLoading.value = false
  }
}

const createNewSession = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const sessionTitle = `Jornada do Posicionamento - ${new Date().toLocaleDateString('pt-BR')}`

    const response = (await $fetch('/api/brand-positioning/sessions', {
      method: 'POST',
      body: { title: sessionTitle }
    })) as any

    if (response.data) {
      // Redireciona para o primeiro capítulo da nova sessão
      await navigateTo(`/brand-positioning/${response.data.id}/chapter/1/mission/1`)
    }
  } catch (error: any) {
    console.error('Erro ao criar sessão:', error)
    errorMessage.value = 'Erro ao criar nova jornada. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

const navigateToSession = (sessionId: string) => {
  navigateTo(`/brand-positioning/${sessionId}`)
}

const statusLabel = (status: string) => {
  const labels = {
    draft: 'Rascunho',
    in_progress: 'Em andamento',
    completed: 'Completa'
  }
  return labels[status as keyof typeof labels] || status
}

const statusBadgeClass = (status: string) => {
  const classes = {
    draft: 'badge-warning',
    in_progress: 'badge-info',
    completed: 'badge-success'
  }
  return classes[status as keyof typeof classes] || 'badge-neutral'
}

onMounted(() => {
  fetchSessions()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <div
          class="mx-auto h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6"
        >
          <div class="text-4xl">🎮</div>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Jornada do Posicionamento</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Descubra o posicionamento único da sua marca através de uma aventura gamificada! Responda
          perguntas estratégicas organizadas em capítulos e missões para construir um posicionamento
          de marca sólido e diferenciado.
        </p>

        <div v-if="!sessions.length && !isLoading" class="mt-8">
          <button
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            :disabled="isLoading"
            @click="createNewSession"
          >
            <span v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5">
              <svg
                class="h-5 w-5"
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
            <Icon v-else name="heroicons:rocket-launch" class="w-6 h-6 mr-3" />
            Iniciar Nova Jornada
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-8 rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && !sessions.length" class="text-center py-12">
        <div class="animate-spin mx-auto h-12 w-12 text-indigo-600">
          <svg class="h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        </div>
        <p class="mt-4 text-gray-600">Carregando suas jornadas...</p>
      </div>

      <!-- Sessions List -->
      <div v-if="sessions.length" class="space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Suas Jornadas</h2>
            <p class="text-gray-600">Continue de onde parou ou inicie uma nova jornada</p>
          </div>
          <!-- <button
            type="button"
            class="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            @click="createNewSession"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Nova Jornada
          </button> -->
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="group relative bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
            @click="navigateToSession(session.id)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors"
                >
                  {{ session.title }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Criado em {{ new Date(session.created_at).toLocaleDateString('pt-BR') }}
                </p>
              </div>
              <div class="badge" :class="statusBadgeClass(session.status)">
                {{ statusLabel(session.status) }}
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso</span>
                <span>{{ session.total_progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${session.total_progress}%` }"
                />
              </div>
            </div>

            <!-- Continue Button -->
            <div class="mt-4 flex justify-end">
              <span
                class="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700"
              >
                {{ session.total_progress === 100 ? 'Revisar' : 'Continuar' }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16 grid gap-8 md:grid-cols-3">
        <div class="text-center">
          <div
            class="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4"
          >
            <Icon name="heroicons:map" class="h-6 w-6 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">6 Capítulos Estruturados</h3>
          <p class="text-gray-600">
            História, Proposta de Valor, Cliente Ideal, Competitividade, Elementos de Marca e Canais
            de Demanda
          </p>
        </div>

        <div class="text-center">
          <div
            class="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4"
          >
            <Icon name="heroicons:trophy" class="h-6 w-6 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Recompensas</h3>
          <p class="text-gray-600">
            Conquiste títulos únicos a cada capítulo completado e torne-se um Arquiteto de Marca
          </p>
        </div>

        <div class="text-center">
          <div
            class="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4"
          >
            <Icon name="heroicons:chart-bar" class="h-6 w-6 text-indigo-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Progresso Visual</h3>
          <p class="text-gray-600">
            Acompanhe sua evolução com barras de progresso e mapa interativo estilo RPG
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
