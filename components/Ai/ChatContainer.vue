<script setup lang="ts">
interface Props {
  session: ChatSession
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  sendMessage: [message: string]
}>()

const chatContainerRef = ref<HTMLDivElement>()

const handleSendMessage = (message: string) => {
  emit('sendMessage', message)
}

watch(
  () => props.session.messages,
  () => {
    nextTick(() => {
      if (chatContainerRef.value) {
        chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
      }
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  })
})
</script>

<template>
  <div class="chat-container flex flex-col h-full">
    <div class="chat-header bg-base-200 p-4 border-b">
      <h2 class="text-lg font-semibold">{{ session.title }}</h2>
    </div>

    <div ref="chatContainerRef" class="chat-messages flex-grow p-4 overflow-y-auto">
      <div
        v-if="session.messages.length === 0"
        class="flex flex-col items-center justify-center h-full text-center"
      >
        <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 text-base-content/20 mb-4" />
        <h3 class="text-xl font-semibold text-base-content mb-2">Inicie uma conversa</h3>
        <p class="text-base-content/70 max-w-md">
          Envie uma mensagem para começar a conversar com o assistente
        </p>
      </div>

      <template v-else>
        <AiChatMessageItem
          v-for="message in session.messages"
          :key="message.id"
          :message="message"
        />
      </template>

      <div v-if="loading" class="py-4">
        <div class="flex items-center space-x-2 bg-base-200 p-3 rounded-lg max-w-[80%]">
          <div class="loading loading-dots loading-sm"></div>
          <span class="text-sm text-base-content/70">Processando...</span>
        </div>
      </div>
    </div>

    <div class="chat-input-container p-4 border-t bg-base-100">
      <AiChatInput @send="handleSendMessage" />
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  height: calc(100vh - 64px);
}

.chat-messages {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--bc) / 0.2) hsl(var(--bc) / 0.05);
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: hsl(var(--bc) / 0.05);
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: hsl(var(--bc) / 0.2);
  border-radius: 3px;
}
</style>
