<script setup lang="ts">
const route = useRoute()
const { tools, fetchTools } = useAiTools()
const toolId = route.params.toolId as string

await fetchTools()

const selectedTool = computed(() => tools.value.find(tool => tool.id === toolId))

if (!selectedTool.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ferramenta não encontrada'
  })
}

const {
  sessions: allSessions,
  loadSessions,
  createSession,
  deleteSession,
  getSessionsByTool
} = useChatSessions()

const toolSessions = getSessionsByTool(toolId)
const currentSession = ref<ChatSession | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const sidebarVisible = ref(true)

const { data: initialSessions, pending: initialLoading } = await useFetch<{
  sessions: ChatSession[]
}>(`/api/chat/sessions?toolId=${toolId}`, {
  key: `initial-chat-sessions-${toolId}`,
  server: true,
  default: () => ({ sessions: [] })
})

const initChat = async () => {
  try {
    isLoading.value = true
    error.value = null

    await loadSessions(toolId)

    if (toolSessions.value.length === 0) {
      await handleNewSession()
    } else {
      currentSession.value = toolSessions.value[0]
    }
  } catch (err) {
    error.value = 'Erro ao carregar sessões de chat'
    loggerError('Erro ao inicializar o chat', { error: err, toolId })
  } finally {
    isLoading.value = false
  }
}

const handleNewSession = async () => {
  try {
    isLoading.value = true
    error.value = null

    const title = `Nova conversa - ${new Date().toLocaleDateString('pt-BR')}`
    const newSession = await createSession(toolId, title)
    currentSession.value = newSession
  } catch (err) {
    error.value = 'Erro ao criar nova sessão'
    loggerError('Erro ao criar nova sessão', { error: err, toolId })
  } finally {
    isLoading.value = false
  }
}

const handleSelectSession = async (sessionId: string) => {
  const session = toolSessions.value.find((s: ChatSession) => s.id === sessionId)
  if (session) {
    currentSession.value = session
  }
}

const handleDeleteSession = async (sessionId: string) => {
  try {
    isLoading.value = true
    error.value = null

    await deleteSession(sessionId)

    if (currentSession.value?.id === sessionId) {
      currentSession.value = null
    }
  } catch (err) {
    error.value = 'Erro ao excluir sessão'
    loggerError('Erro ao excluir sessão', { error: err, sessionId })
  } finally {
    isLoading.value = false
  }
}

const handleSendMessage = async (message: string) => {
  if (!currentSession.value) return

  try {
    // TODO: Implementar envio de mensagens
    console.log('Enviando mensagem:', message)
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err)
  }
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

onMounted(() => {
  if (toolSessions.value.length > 0) {
    currentSession.value = toolSessions.value[0]
  }
})

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useHead({
  title: `${selectedTool.value?.name} - Nexttera AI Tools`,
  meta: [{ name: 'description', content: selectedTool.value?.description }]
})
</script>

<template>
  <div class="chat-page flex h-screen">
    <div v-if="sidebarVisible" class="chat-sidebar-container">
      <AiChatSidebar
        :sessions="toolSessions"
        :active-session-id="currentSession?.id"
        :tool-id="toolId"
        :loading="isLoading"
        @new-session="handleNewSession"
        @select-session="handleSelectSession"
        @delete-session="handleDeleteSession"
      />
    </div>

    <div class="chat-main-container flex-grow flex flex-col relative">
      <div class="absolute top-4 left-4 z-10">
        <button
          @click="toggleSidebar"
          class="btn btn-circle btn-sm"
          :class="sidebarVisible ? 'btn-ghost' : 'btn-primary'"
        >
          <Icon
            :name="sidebarVisible ? 'heroicons:chevron-left' : 'heroicons:bars-3'"
            class="w-5 h-5"
          />
        </button>
      </div>

      <template v-if="currentSession">
        <AiChatContainer
          :session="currentSession"
          :loading="isLoading"
          @send-message="handleSendMessage"
        />
      </template>

      <div
        v-else-if="isLoading || initialLoading"
        class="flex flex-col items-center justify-center h-full"
      >
        <div class="loading loading-spinner loading-lg"></div>
        <p class="mt-4 text-base-content/70">Carregando...</p>
      </div>

      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center h-full p-4 text-center"
      >
        <Icon name="heroicons:exclamation-circle" class="w-16 h-16 text-error mb-4" />
        <h3 class="text-xl font-bold text-error mb-2">Ocorreu um erro</h3>
        <p class="text-base-content/70 mb-4">{{ error }}</p>
        <button
          @click="initChat"
          class="btn btn-primary"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Tentar novamente</span>
        </button>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-full p-4 text-center">
        <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 text-base-content/20 mb-4" />
        <h3 class="text-xl font-bold text-base-content mb-2">Nenhuma conversa ativa</h3>
        <p class="text-base-content/70 mb-4">Inicie uma nova conversa para começar</p>
        <button
          @click="handleNewSession"
          class="btn btn-primary"
          :class="{ loading: isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Nova conversa</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  height: calc(100vh - 64px);
}

.chat-sidebar-container {
  width: 320px;
  max-width: 30%;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .chat-sidebar-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 50;
    max-width: 80%;
  }
}
</style>
