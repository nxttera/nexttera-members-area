<script setup lang="ts">
import type { BrandPositioningSession } from '~/shared/types/brand-positioning'

definePageMeta({
  middleware: 'onboarding'
})

const route = useRoute()
const sessionId = route.params.sessionId as string

const session = ref<BrandPositioningSession | null>(null)
const chapters = ref([] as any[])
const chapterProgress = ref({} as Record<number, number>)
const isLoading = ref(false)
const errorMessage = ref('')

const fetchSessionData = async () => {
  try {
    isLoading.value = true

    const [sessionResponse, chaptersResponse, progressResponse] = await Promise.all([
      $fetch(`/api/brand-positioning/sessions/${sessionId}`) as any,
      $fetch('/api/brand-positioning/chapters') as any,
      $fetch(`/api/brand-positioning/sessions/${sessionId}/progress`) as any
    ])

    session.value = sessionResponse.data
    chapters.value = chaptersResponse.data || []
    chapterProgress.value = progressResponse.data || {}
  } catch (error: any) {
    console.error('Erro ao carregar dados da sessão:', error)
    errorMessage.value = 'Erro ao carregar dados da sessão'
  } finally {
    isLoading.value = false
  }
}

const navigateToChapter = (chapterOrder: number) => {
  navigateTo(`/brand-positioning/${sessionId}/chapter/${chapterOrder}/mission/1`)
}

const getChapterProgress = (chapterOrder: number) => {
  return chapterProgress.value[chapterOrder] || 0
}

const getChapterIcon = (chapterOrder: number) => {
  const icons = {
    1: '📚', // História & Credo
    2: '💎', // Proposta de Valor
    3: '🎯', // Cliente Ideal
    4: '⚔️', // Competitivo
    5: '🎨', // Elementos de Marca
    6: '📢' // Canais de Demanda
  }
  return icons[chapterOrder as keyof typeof icons] || '📋'
}

onMounted(() => {
  fetchSessionData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <nav class="flex" aria-label="Breadcrumb">
            <ol role="list" class="flex items-center space-x-4">
              <li>
                <div>
                  <NuxtLink to="/brand-positioning" class="text-gray-500 hover:text-gray-700">
                    <Icon name="heroicons:home" class="h-5 w-5" />
                  </NuxtLink>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">
                    {{ session?.title || 'Carregando...' }}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">
            {{ session?.title || 'Carregando sessão...' }}
          </h1>
        </div>

        <div v-if="session" class="text-right">
          <div class="text-sm text-gray-500">Progresso Geral</div>
          <div class="text-2xl font-bold text-indigo-600">{{ session.total_progress }}%</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
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
        <p class="mt-4 text-gray-600">Carregando sua jornada...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="rounded-md bg-red-50 p-4 border border-red-200">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Chapters Grid -->
      <div v-else-if="chapters.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="group relative bg-white rounded-lg border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer"
          @click="navigateToChapter(chapter.order_number)"
        >
          <!-- Chapter Icon -->
          <div class="flex items-center justify-between mb-4">
            <div class="text-4xl">{{ getChapterIcon(chapter.order_number) }}</div>
            <div class="text-sm text-gray-500">Capítulo {{ chapter.order_number }}</div>
          </div>

          <!-- Chapter Title -->
          <h3
            class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2"
          >
            {{ chapter.title }}
          </h3>

          <!-- Chapter Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-3">
            {{ chapter.description }}
          </p>

          <!-- Progress Bar -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progresso</span>
              <span>{{ getChapterProgress(chapter.order_number) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${getChapterProgress(chapter.order_number)}%` }"
              />
            </div>
          </div>

          <!-- Action -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ chapter.missions_count || 0 }} missões</span>
            <span
              class="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700"
            >
              {{ getChapterProgress(chapter.order_number) === 100 ? 'Revisar' : 'Continuar' }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div
          class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6"
        >
          <Icon name="heroicons:document-text" class="h-12 w-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum capítulo disponível</h3>
        <p class="text-gray-600">Os capítulos serão carregados em breve.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
