<script setup lang="ts">
const route = useRoute()
const { tools, fetchTools } = useAiTools()
const { sessions, loadSessions, createSession, deleteSession, getSessionsByTool } =
  useChatSessions()

const toolId = route.params.toolId as string
const currentSessionId = ref<string | null>(null)
const sidebarCollapsed = ref(false)

await fetchTools()

const selectedTool = computed(() => tools.value.find(tool => tool.id === toolId))

if (!selectedTool.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Ferramenta não encontrada'
  })
}

await loadSessions(toolId)
const toolSessions = getSessionsByTool(toolId)

const handleNewChat = async () => {
  if (!selectedTool.value) return

  try {
    const session = await createSession(toolId)
    await handleSelectSession(session.id)
  } catch (error) {
    loggerError('Erro ao criar nova sessão', { error, toolId })
  }
}

const handleSelectSession = async (sessionId: string) => {
  currentSessionId.value = sessionId

  const chatStore = useChatMessagesStore()
  await chatStore.switchToSession(sessionId)

  loggerInfo('🟠 PAGE: Sessão selecionada', {
    sessionId,
    component: 'chat-page'
  })
}

const handleDeleteSession = async (sessionId: string) => {
  try {
    await deleteSession(sessionId)

    if (currentSessionId.value === sessionId) {
      const remainingSessions = toolSessions.value
      if (remainingSessions.length > 0) {
        currentSessionId.value = remainingSessions[0].id
      } else {
        currentSessionId.value = null
      }
    }
  } catch (error) {
    loggerError('Erro ao deletar sessão', { error, sessionId })
  }
}

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

const handleMessageSent = () => {
  // A atualização do last_message_at será feita automaticamente
  // pelos composables quando uma nova mensagem for enviada
}

onMounted(async () => {
  if (toolSessions.value.length > 0) {
    const latestSession = toolSessions.value[0]
    await handleSelectSession(latestSession.id)
  }
})

useHead({
  title: `${selectedTool.value?.name} - Nexttera AI Tools`,
  meta: [{ name: 'description', content: selectedTool.value?.description }]
})
</script>

<template>
  <div
    v-if="selectedTool"
    class="flex h-[calc(100vh-200px)] bg-base-100 rounded-lg shadow-sm overflow-hidden"
  >
    <aside
      class="bg-base-200 border-r border-base-300 transition-all duration-300"
      :class="sidebarCollapsed ? 'w-16' : 'w-80'"
    >
      <div class="p-4 border-b border-base-300">
        <div class="flex items-center justify-between">
          <div v-if="!sidebarCollapsed" class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{ backgroundColor: selectedTool.config.customization.primaryColor + '20' }"
            >
              <Icon
                name="heroicons:cpu-chip"
                class="h-5 w-5"
                :style="{ color: selectedTool.config.customization.primaryColor }"
              />
            </div>
            <div>
              <h2 class="font-semibold text-base-content text-sm">{{ selectedTool.name }}</h2>
              <p class="text-xs text-base-content/60">{{ toolSessions.length }} sessões</p>
            </div>
          </div>

          <button
            @click="sidebarCollapsed = !sidebarCollapsed"
            class="btn btn-ghost btn-sm btn-circle"
          >
            <Icon
              :name="sidebarCollapsed ? 'heroicons:chevron-right' : 'heroicons:chevron-left'"
              class="h-4 w-4"
            />
          </button>
        </div>

        <button
          v-if="!sidebarCollapsed"
          @click="handleNewChat"
          class="btn btn-primary btn-sm w-full mt-3"
          :style="{ backgroundColor: selectedTool.config.customization.primaryColor }"
        >
          <Icon name="heroicons:plus" class="h-4 w-4" />
          Nova Conversa
        </button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="!sidebarCollapsed" class="p-2">
          <div v-if="toolSessions.length === 0" class="text-center py-8">
            <Icon
              name="heroicons:chat-bubble-left"
              class="h-12 w-12 mx-auto text-base-content/20 mb-3"
            />
            <p class="text-sm text-base-content/60">Nenhuma conversa ainda</p>
            <p class="text-xs text-base-content/40">Clique em "Nova Conversa" para começar</p>
          </div>

          <div v-else class="space-y-1">
            <div v-for="session in toolSessions" :key="session.id" class="group relative">
              <button
                @click="handleSelectSession(session.id)"
                class="w-full p-3 rounded-lg text-left transition-colors"
                :class="
                  currentSessionId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-base-300/50'
                "
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-base-content truncate">
                      {{ session.title }}
                    </p>
                    <p
                      v-if="session.messages && session.messages.length > 0"
                      class="text-xs text-base-content/60 truncate mt-1"
                    >
                      {{ session.messages[session.messages.length - 1]?.content }}
                    </p>
                    <p class="text-xs text-base-content/40 mt-1">
                      {{ formatRelativeTime(new Date(session.last_message_at)) }}
                    </p>
                  </div>

                  <button
                    @click.stop="handleDeleteSession(session.id)"
                    class="opacity-0 group-hover:opacity-100 btn btn-ghost btn-xs btn-circle text-error"
                  >
                    <Icon name="heroicons:trash" class="h-3 w-3" />
                  </button>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="p-2 space-y-2">
          <button
            @click="handleNewChat"
            class="btn btn-ghost btn-sm btn-circle w-full"
            title="Nova Conversa"
          >
            <Icon name="heroicons:plus" class="h-4 w-4" />
          </button>

          <div v-for="session in toolSessions.slice(0, 8)" :key="session.id">
            <button
              @click="handleSelectSession(session.id)"
              class="btn btn-ghost btn-sm btn-circle w-full"
              :class="currentSessionId === session.id ? 'btn-primary' : ''"
              :title="session.title"
            >
              <Icon name="heroicons:chat-bubble-left" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col">
      <div v-if="!currentSessionId" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div
            class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            :style="{ backgroundColor: selectedTool.config.customization.primaryColor + '10' }"
          >
            <Icon
              name="heroicons:chat-bubble-left"
              class="h-10 w-10"
              :style="{ color: selectedTool.config.customization.primaryColor }"
            />
          </div>
          <h3 class="text-xl font-semibold text-base-content mb-2">
            {{ selectedTool.config.title }}
          </h3>
          <p class="text-base-content/60 mb-6 max-w-md">
            {{ selectedTool.config.subtitle }}
          </p>
          <button
            @click="handleNewChat"
            class="btn btn-primary"
            :style="{ backgroundColor: selectedTool.config.customization.primaryColor }"
          >
            <Icon name="heroicons:plus" class="h-4 w-4" />
            Começar Nova Conversa
          </button>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col">
        <div class="flex-1 overflow-hidden">
          <ChatMessagesList
            :session-id="currentSessionId"
            :tool-color="selectedTool.config.customization.primaryColor"
          />
        </div>

        <ChatMessageInput
          :session-id="currentSessionId"
          :placeholder="selectedTool.config.placeholder"
          :tool-color="selectedTool.config.customization.primaryColor"
          @message-sent="handleMessageSent"
        />
      </div>
    </main>
  </div>

  <div v-else class="flex items-center justify-center min-h-[400px]">
    <div class="text-center">
      <Icon name="heroicons:exclamation-triangle" class="h-16 w-16 mx-auto text-warning mb-4" />
      <h1 class="text-2xl font-bold text-base-content mb-2">Ferramenta não encontrada</h1>
      <p class="text-base-content/70 mb-6">A ferramenta solicitada não está disponível.</p>
      <NuxtLink to="/chats" class="btn btn-primary">
        <Icon name="heroicons:arrow-left" class="h-4 w-4" />
        Voltar às Ferramentas
      </NuxtLink>
    </div>
  </div>
</template>
