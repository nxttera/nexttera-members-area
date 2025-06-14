<script setup lang="ts">
interface Props {
  sessions: ChatSession[]
  activeSessionId?: string
  toolId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  newSession: []
  selectSession: [sessionId: string]
  deleteSession: [sessionId: string]
}>()

const searchQuery = ref('')
const menuOpen = ref<string | null>(null)

const filteredSessions = computed(() => {
  if (!searchQuery.value.trim()) return props.sessions

  const query = searchQuery.value.toLowerCase()
  return props.sessions.filter(session => session.title.toLowerCase().includes(query))
})

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
  return `${Math.floor(diffInMinutes / 1440)}d`
}

const toggleMenu = (sessionId: string) => {
  if (menuOpen.value === sessionId) {
    menuOpen.value = null
  } else {
    menuOpen.value = sessionId
  }
}

const closeMenu = () => {
  menuOpen.value = null
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuOpen.value && !event.target) {
    closeMenu()
  }
}

const handleNewSession = () => {
  emit('newSession')
  closeMenu()
}

const handleSelectSession = (sessionId: string) => {
  emit('selectSession', sessionId)
  closeMenu()
}

const handleDeleteSession = (sessionId: string) => {
  emit('deleteSession', sessionId)
  closeMenu()
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="chat-sidebar h-full flex flex-col bg-base-200 border-r">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Conversas</h2>
        <button @click="handleNewSession" class="btn btn-sm btn-primary" title="Nova conversa">
          <Icon name="heroicons:plus" class="w-4 h-4" />
        </button>
      </div>

      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar conversa..."
          class="input input-sm w-full bg-base-100"
        />
        <Icon
          v-if="!searchQuery"
          name="heroicons:magnifying-glass"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
        />
        <button
          v-else
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <Icon name="heroicons:x-mark" class="w-4 h-4 text-base-content/50" />
        </button>
      </div>
    </div>

    <div class="overflow-y-auto flex-grow p-2">
      <div v-if="filteredSessions.length === 0" class="text-center p-4 text-base-content/70">
        <p v-if="searchQuery">Nenhuma conversa encontrada</p>
        <p v-else>Nenhuma conversa iniciada</p>
      </div>

      <div v-else class="space-y-1">
        <div v-for="session in filteredSessions" :key="session.id" class="relative">
          <button
            @click="handleSelectSession(session.id)"
            class="w-full text-left p-3 rounded-lg transition-colors hover:bg-base-300 flex items-start"
            :class="[session.id === activeSessionId ? 'bg-base-300' : '']"
          >
            <div class="flex-grow min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-sm truncate">{{ session.title }}</h3>
                <span class="text-xs text-base-content/60 flex-shrink-0 ml-2">
                  {{ formatRelativeTime(session.lastMessageAt) }}
                </span>
              </div>

              <p v-if="session.messages?.length" class="text-xs text-base-content/70 truncate mt-1">
                {{ session.messages[session.messages.length - 1].content }}
              </p>
            </div>

            <button
              @click.stop="toggleMenu(session.id)"
              class="ml-2 btn btn-ghost btn-xs btn-circle"
            >
              <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
            </button>
          </button>

          <!-- Menu de opções -->
          <div
            v-if="menuOpen === session.id"
            class="absolute right-0 top-10 z-10 bg-base-100 shadow-lg rounded-lg w-48 py-1 border"
          >
            <button
              @click="handleDeleteSession(session.id)"
              class="w-full text-left px-4 py-2 text-sm hover:bg-base-200 text-error flex items-center"
            >
              <Icon name="heroicons:trash" class="w-4 h-4 mr-2" />
              Excluir conversa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-sidebar {
  width: 320px;
  max-width: 100%;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--bc) / 0.2) hsl(var(--bc) / 0.05);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: hsl(var(--bc) / 0.05);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: hsl(var(--bc) / 0.2);
  border-radius: 2px;
}
</style>
