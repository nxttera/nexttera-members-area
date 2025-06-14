<script setup lang="ts">
interface Props {
  sessionId: string | null
  toolColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  toolColor: '#3B82F6'
})

const store = useChatMessagesStore()
const { messages, isLoading, isLoadingMore, hasMoreMessages, error, isTyping } = storeToRefs(store)

const { dots, startAnimation, stopAnimation } = useTypingAnimation()

const messagesContainer = ref<HTMLDivElement>()
const shouldAutoScroll = ref(true)

const scrollToBottom = () => {
  if (messagesContainer.value && shouldAutoScroll.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleScroll = () => {
  if (!messagesContainer.value) return

  const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

  shouldAutoScroll.value = isAtBottom

  if (scrollTop < 100 && store.hasMoreMessages && !store.isLoadingMore) {
    store.loadMoreMessages()
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

watch(
  () => props.sessionId,
  newSessionId => {
    if (newSessionId) {
      store.switchToSession(newSessionId)
    }
  },
  { immediate: true }
)

watch(
  () => messages.value.length,
  (newLength, oldLength) => {
    if (newLength > oldLength) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
)

watch(
  messages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true, immediate: true }
)

watch(
  () => isTyping,
  typing => {
    if (typing) {
      startAnimation()
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      stopAnimation()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (messagesContainer.value) {
    messagesContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div v-if="error" class="alert alert-error mb-4">
      <Icon name="heroicons:exclamation-triangle" class="h-5 w-5" />
      <span>{{ error }}</span>
    </div>

    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-4 messages-container"
      :class="{ 'opacity-50': isLoading }"
    >
      <div v-if="isLoadingMore" class="flex justify-center py-4">
        <span class="loading loading-dots loading-md"></span>
      </div>

      <div
        v-if="messages.length === 0 && !isLoading"
        class="flex items-center justify-center h-full text-center"
      >
        <div>
          <Icon
            name="heroicons:chat-bubble-left"
            class="h-16 w-16 mx-auto text-base-content/20 mb-4"
          />
          <p class="text-base-content/60">Nenhuma mensagem ainda</p>
          <p class="text-sm text-base-content/40">Comece uma conversa!</p>
        </div>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        class="flex"
        :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl"
          :class="
            message.type === 'user'
              ? 'bg-primary text-primary-content rounded-br-md'
              : 'bg-base-200 text-base-content rounded-bl-md'
          "
          :style="message.type === 'user' ? { backgroundColor: toolColor } : {}"
        >
          <div v-if="message.type === 'bot'" class="flex items-center gap-2 mb-2">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: toolColor + '20' }"
            >
              <Icon name="heroicons:cpu-chip" class="h-3 w-3" :style="{ color: toolColor }" />
            </div>
            <span class="text-xs font-medium text-base-content/60">AI Assistant</span>
          </div>

          <div class="whitespace-pre-wrap break-words">
            <span
              v-if="message.id === 'typing-indicator'"
              class="inline-flex items-center animate-pulse"
            >
              <span class="mr-2 text-sm opacity-70">Digitando</span>
              <span class="font-mono text-lg">{{ dots }}</span>
            </span>
            <span v-else>{{ message.content }}</span>
          </div>

          <div
            class="text-xs mt-2"
            :class="message.type === 'user' ? 'text-primary-content/70' : 'text-base-content/50'"
          >
            {{ formatTime(message.created_at) }}
          </div>
        </div>
      </div>

      <div v-if="isLoading && messages.length === 0" class="flex justify-center py-8">
        <div class="flex items-center gap-3">
          <span class="loading loading-dots loading-md"></span>
          <span class="text-base-content/60">Carregando mensagens...</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.messages-container {
  max-height: calc(100vh - 20rem);
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--primary-content);
}
</style>
