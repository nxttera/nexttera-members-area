<script setup lang="ts">
definePageMeta({
  middleware: 'onboarding'
})

const route = useRoute()
const sessionId = route.params.sessionId as string
const chapterId = parseInt(route.params.chapterId as string)
const missionId = parseInt(route.params.missionId as string)

const mission = ref(null as any)
const chapter = ref(null as any)
const questions = ref([] as any[])
const answers = ref({} as Record<string, any>)
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')

const fetchMissionData = async () => {
  try {
    isLoading.value = true

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    if (!user.value) {
      errorMessage.value = 'Usuário não autenticado'
      return
    }

    const [missionResponse, questionsResponse] = await Promise.all([
      $fetch(`/api/brand-positioning/missions/${missionId}`, {
        headers: useRequestHeaders(['cookie'])
      }) as any,
      $fetch(`/api/brand-positioning/missions/${missionId}/questions`, {
        headers: useRequestHeaders(['cookie'])
      }) as any
    ])

    mission.value = missionResponse.data
    chapter.value = missionResponse.chapter
    questions.value = questionsResponse.data || []

    // Carregar respostas salvas se existirem
    try {
      const savedAnswers = (await $fetch(
        `/api/brand-positioning/sessions/${sessionId}/mission/${missionId}/answers`,
        {
          headers: useRequestHeaders(['cookie'])
        }
      )) as any
      if (savedAnswers.data) {
        answers.value = savedAnswers.data
      }
    } catch (error) {
      // Não há respostas salvas ainda
    }
  } catch (error: any) {
    console.error('Erro ao carregar dados da missão:', error)
    errorMessage.value = 'Erro ao carregar dados da missão'
  } finally {
    isLoading.value = false
  }
}

const saveAnswers = async () => {
  try {
    isSaving.value = true
    errorMessage.value = ''

    // Validação básica
    if (!sessionId || !missionId) {
      throw new Error('IDs de sessão e missão são obrigatórios')
    }

    if (!answers.value || Object.keys(answers.value).length === 0) {
      throw new Error('Pelo menos uma pergunta deve ser respondida')
    }

    // Primeiro, verificar se a sessão existe
    try {
      await $fetch(`/api/brand-positioning/sessions/${sessionId}`, {
        headers: useRequestHeaders(['cookie'])
      })
    } catch (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError)
      throw new Error('Sessão não encontrada ou inválida')
    }

    // Processar respostas para salvar (converter arrays em strings se necessário)
    const processedAnswers: Record<string, string> = {}

    Object.entries(answers.value).forEach(([questionId, answer]) => {
      if (Array.isArray(answer)) {
        // Multi-select: converter array para string JSON
        processedAnswers[questionId] = JSON.stringify(answer)
      } else {
        // Outras respostas: converter para string
        processedAnswers[questionId] = String(answer || '')
      }
    })

    // Salvar as respostas
    const response = await $fetch(
      `/api/brand-positioning/sessions/${sessionId}/mission/${missionId}/answers`,
      {
        method: 'POST',
        body: {
          answers: processedAnswers
        },
        headers: useRequestHeaders(['cookie'])
      }
    )

    console.log('Respostas salvas com sucesso:', response)

    // Redirecionar para próxima missão ou capítulo
    const nextMissionId = missionId + 1
    navigateTo(`/brand-positioning/${sessionId}/chapter/${chapterId}/mission/${nextMissionId}`)
  } catch (error: any) {
    console.error('Erro detalhado ao salvar respostas:', error)
    errorMessage.value = `Erro ao salvar respostas: ${error.message || error.statusMessage || 'Tente novamente.'}`

    // Scroll para o topo para mostrar a mensagem de erro
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  if (missionId > 1) {
    navigateTo(`/brand-positioning/${sessionId}/chapter/${chapterId}/mission/${missionId - 1}`)
  } else {
    navigateTo(`/brand-positioning/${sessionId}`)
  }
}

const getMissionProgress = () => {
  if (!questions.value.length) return 0
  const answeredQuestions = Object.keys(answers.value).length
  return Math.round((answeredQuestions / questions.value.length) * 100)
}

const isFormValid = () => {
  const requiredQuestions = questions.value.filter(q => q.is_required)
  return requiredQuestions.every(q => answers.value[q.id])
}

const getMultiSelectValue = (questionId: number, option: string) => {
  const currentValue = answers.value[questionId]
  if (Array.isArray(currentValue)) {
    return currentValue.includes(option)
  }
  return false
}

const toggleMultiSelectOption = (questionId: number, option: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const currentValue = answers.value[questionId] || []

  if (target.checked) {
    if (!Array.isArray(currentValue)) {
      answers.value[questionId] = [option]
    } else {
      answers.value[questionId] = [...currentValue, option]
    }
  } else {
    if (Array.isArray(currentValue)) {
      answers.value[questionId] = currentValue.filter(item => item !== option)
    }
  }
}

const parseQuestionOptions = (options: any): string[] => {
  if (!options) return []

  // Se já é um array, retorna direto
  if (Array.isArray(options)) return options

  // Se é string, tenta fazer parse
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.warn('Erro ao fazer parse das opções:', options, error)
      // Tenta dividir por vírgula como fallback
      return options
        .split(',')
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0)
    }
  }

  console.warn('Tipo inesperado para options:', typeof options, options)
  return []
}

onMounted(() => {
  fetchMissionData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
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
              <NuxtLink
                :to="`/brand-positioning/${sessionId}`"
                class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Sessão
              </NuxtLink>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
              <span class="ml-4 text-sm font-medium text-gray-500">
                {{ chapter?.title || `Capítulo ${chapterId}` }}
              </span>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <Icon name="heroicons:chevron-right" class="h-5 w-5 text-gray-400" />
              <span class="ml-4 text-sm font-medium text-gray-500">
                {{ mission?.title || `Missão ${missionId}` }}
              </span>
            </div>
          </li>
        </ol>
      </nav>

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
        <p class="mt-4 text-gray-600">Carregando missão...</p>
      </div>

      <!-- Mission Content -->
      <div v-else-if="mission" class="space-y-8">
        <!-- Header -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <span class="text-2xl">🎯</span>
                <h1 class="text-2xl font-bold text-gray-900">
                  {{ mission.title }}
                </h1>
              </div>
              <p class="text-gray-600 mb-4">{{ mission.description }}</p>

              <!-- Progress -->
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso da Missão</span>
                    <span>{{ getMissionProgress() }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${getMissionProgress()}%` }"
                    />
                  </div>
                </div>
                <div class="text-sm text-gray-600">
                  {{ Object.keys(answers).length }}/{{ questions.length }} perguntas
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
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

        <!-- Questions Form -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
          <form @submit.prevent="saveAnswers" class="space-y-8">
            <div v-for="question in questions" :key="question.id" class="space-y-3">
              <label
                :for="`question-${question.id}`"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                {{ question.text }}
                <span v-if="question.is_required" class="text-red-500">*</span>
              </label>

              <!-- Text Input -->
              <div v-if="question.question_type === 'text'" class="mt-2">
                <input
                  :id="`question-${question.id}`"
                  v-model="answers[question.id]"
                  type="text"
                  :name="`question-${question.id}`"
                  :placeholder="question.description || 'Digite sua resposta...'"
                  class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  :required="question.is_required"
                />
              </div>

              <!-- Textarea -->
              <div v-else-if="question.question_type === 'textarea'" class="mt-2">
                <textarea
                  :id="`question-${question.id}`"
                  v-model="answers[question.id]"
                  :name="`question-${question.id}`"
                  rows="4"
                  :placeholder="question.description || 'Digite sua resposta...'"
                  class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  :required="question.is_required"
                />
              </div>

              <!-- Select -->
              <div v-else-if="question.question_type === 'select'" class="mt-2">
                <select
                  :id="`question-${question.id}`"
                  v-model="answers[question.id]"
                  :name="`question-${question.id}`"
                  class="block w-full rounded-md border-0 py-3 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  :required="question.is_required"
                >
                  <option value="">Selecione uma opção...</option>
                  <template v-if="parseQuestionOptions(question.options).length > 0">
                    <option
                      v-for="option in parseQuestionOptions(question.options)"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </template>
                  <option v-else disabled>Nenhuma opção disponível</option>
                </select>
              </div>

              <!-- Multi Select -->
              <div v-else-if="question.question_type === 'multi_select'" class="mt-2">
                <div
                  v-if="parseQuestionOptions(question.options).length > 0"
                  class="grid grid-cols-2 gap-3"
                >
                  <label
                    v-for="option in parseQuestionOptions(question.options)"
                    :key="option"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :value="option"
                      :checked="getMultiSelectValue(question.id, option)"
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      @change="toggleMultiSelectOption(question.id, option, $event)"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ option }}</span>
                  </label>
                </div>
                <div v-else class="text-gray-500 italic">Nenhuma opção disponível para seleção</div>
              </div>

              <!-- Unknown type -->
              <div v-else class="text-gray-500 italic">
                Tipo de pergunta não implementado ainda: {{ question.question_type }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                class="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                @click="goBack"
              >
                <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                Voltar
              </button>

              <button
                type="submit"
                class="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSaving || !isFormValid()"
              >
                <span v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4">
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
                <Icon v-else name="heroicons:arrow-right" class="w-4 h-4 mr-2" />
                {{ isSaving ? 'Salvando...' : 'Próxima Missão' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Empty/Error State -->
      <div v-else class="text-center py-12">
        <div
          class="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6"
        >
          <Icon name="heroicons:exclamation-triangle" class="h-12 w-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Missão não encontrada</h3>
        <p class="text-gray-600 mb-4">
          A missão solicitada não foi encontrada ou não está disponível.
        </p>
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          @click="goBack"
        >
          Voltar
        </button>
      </div>
    </div>
  </div>
</template>
