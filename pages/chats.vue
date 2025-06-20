<script setup lang="ts">
import type { AiAgentTool } from '~/shared/types/chat.types'

definePageMeta({
  title: 'Ferramentas de IA',
  layout: 'default'
})

const { tools, isLoading, error, fetchTools } = useAiAgents()
const selectedTool = ref<AiAgentTool | null>(null)
const showChatWidget = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')

const toolCategories = [
  { value: 'all', label: 'Todas as Ferramentas', icon: 'heroicons:squares-2x2' },
  { value: 'copywriting', label: 'Copywriting', icon: 'heroicons:pencil-square' },
  { value: 'support', label: 'Suporte', icon: 'heroicons:chat-bubble-left-right' },
  { value: 'sales', label: 'Vendas', icon: 'heroicons:currency-dollar' },
  { value: 'analysis', label: 'Análise', icon: 'heroicons:chart-bar' },
  { value: 'general', label: 'Geral', icon: 'heroicons:question-mark-circle' }
]

const filteredTools = computed(() => {
  let filtered = tools.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(tool => tool.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.features.some(feature => feature.toLowerCase().includes(query))
    )
  }

  return filtered
})

const availableTools = computed(() => filteredTools.value.filter(tool => tool.isAvailable))

const upcomingTools = computed(() => filteredTools.value.filter(tool => !tool.isAvailable))

const featuredTools = computed(() =>
  availableTools.value.filter(tool => tool.features.length >= 4).slice(0, 2)
)

const handleStartChat = (tool: AiAgentTool) => {
  navigateTo(`/chat/${tool.id}`)
}

const handleChatClosed = () => {
  showChatWidget.value = false
  selectedTool.value = null
}

const handleOpenExternalChat = (url: string) => {
  const toolId = selectedTool.value?.id
  if (toolId) {
    navigateTo(`/chat/${toolId}`, {
      open: {
        target: '_blank'
      }
    })
  }
  handleChatClosed()
}

const handleClearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

onMounted(() => {
  fetchTools()
})
</script>

<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-base-content mb-2">Ferramentas de IA</h1>
      <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
        Potencialize seu RevOps com nossa suite de assistentes inteligentes especializados
      </p>
    </div>

    <div class="bg-base-100 p-6 rounded-lg shadow-sm">
      <div class="flex flex-col lg:flex-row gap-6 mb-8">
        <div class="flex-1">
          <div class="form-control">
            <div class="input-group">
              <span class="bg-base-200">
                <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar ferramentas por nome, descrição ou recursos..."
                class="input input-bordered flex-1"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <button
            v-for="category in toolCategories"
            :key="category.value"
            @click="selectedCategory = category.value"
            class="btn btn-sm"
            :class="selectedCategory === category.value ? 'btn-primary' : 'btn-outline'"
          >
            <Icon :name="category.icon" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ category.label }}</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-16">
        <div class="text-center">
          <div class="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p class="text-base-content/70">Carregando ferramentas de IA...</p>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-error">
        <Icon name="heroicons:exclamation-triangle" class="h-5 w-5" />
        <span>{{ error }}</span>
      </div>

      <div v-else-if="filteredTools.length === 0" class="text-center py-16">
        <Icon name="heroicons:cpu-chip" class="h-20 w-20 mx-auto text-base-content/20 mb-6" />
        <h3 class="text-xl font-semibold text-base-content mb-3">Nenhuma ferramenta encontrada</h3>
        <p class="text-base-content/70 mb-6">
          {{
            searchQuery || selectedCategory !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Novas ferramentas em breve'
          }}
        </p>
        <button @click="handleClearFilters" class="btn btn-outline">Limpar filtros</button>
      </div>

      <div v-else class="space-y-10">
        <!-- <div v-if="featuredTools.length > 0 && !searchQuery && selectedCategory === 'all'">
          <div class="flex items-center gap-3 mb-6">
            <Icon name="heroicons:star" class="h-6 w-6 text-yellow-500" />
            <h2 class="text-2xl font-bold text-base-content">Ferramentas em Destaque</h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AiChatAgentCard
              v-for="tool in featuredTools"
              :key="tool.id"
              :tool="tool"
              :featured="true"
              @start-chat="handleStartChat"
            />
          </div>
        </div> -->

        <div v-if="availableTools.length > 0">
          <div class="flex items-center gap-3 mb-6">
            <Icon name="heroicons:check-circle" class="h-6 w-6 text-success" />
            <h2 class="text-2xl font-bold text-base-content">
              Disponíveis Agora
              <span class="text-lg font-normal text-base-content/60"
                >({{ availableTools.length }})</span
              >
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AiChatAgentCard
              v-for="tool in availableTools"
              :key="tool.id"
              :tool="tool"
              @start-chat="handleStartChat"
            />
          </div>
        </div>

        <div v-if="upcomingTools.length > 0">
          <div class="flex items-center gap-3 mb-6">
            <Icon name="heroicons:clock" class="h-6 w-6 text-warning" />
            <h2 class="text-2xl font-bold text-base-content">
              Em Desenvolvimento
              <span class="text-lg font-normal text-base-content/60"
                >({{ upcomingTools.length }})</span
              >
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AiChatAgentCard
              v-for="tool in upcomingTools"
              :key="tool.id"
              :tool="tool"
              @start-chat="handleStartChat"
            />
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showChatWidget && selectedTool"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <div class="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <AiChatWidget
            :tool="selectedTool"
            :is-visible="showChatWidget"
            @chat-closed="handleChatClosed"
            @open-external-chat="handleOpenExternalChat"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
