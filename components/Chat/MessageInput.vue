<script setup lang="ts">
interface Props {
  sessionId: string | null
  placeholder?: string
  toolColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Digite sua mensagem...',
  toolColor: '#3B82F6',
  disabled: false
})

const emit = defineEmits<{
  messageSent: [message: string]
}>()

const chatStore = useChatMessagesStore()

const messageInput = ref('')
const textareaRef = ref<HTMLTextAreaElement>()

const canSend = computed(
  () => messageInput.value.trim().length > 0 && !props.disabled && props.sessionId
)

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
  }
}

const handleSendMessage = async () => {
  if (!canSend.value) {
    return
  }

  const content = messageInput.value.trim()

  messageInput.value = ''
  emit('messageSent', content)

  nextTick(() => {
    adjustTextareaHeight()
    textareaRef.value?.focus()
  })

  try {
    await chatStore.sendMessage(content, props.sessionId || undefined)
  } catch (error) {
    messageInput.value = content
    nextTick(() => {
      adjustTextareaHeight()
      textareaRef.value?.focus()
    })
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

watch(messageInput, () => {
  nextTick(adjustTextareaHeight)
})

onMounted(() => {
  adjustTextareaHeight()
})
</script>

<template>
  <div class="border-t border-base-300 bg-base-100 p-4">
    <div class="flex items-end gap-3 max-w-4xl mx-auto">
      <div class="flex-1">
        <textarea
          ref="textareaRef"
          v-model="messageInput"
          :placeholder="placeholder"
          :disabled="disabled || !sessionId"
          class="textarea textarea-bordered w-full min-h-[2.5rem] max-h-32 resize-none focus:border-primary"
          :class="{
            'opacity-50 cursor-not-allowed': disabled || !sessionId
          }"
          @keydown="handleKeyDown"
        />

        <div v-if="!sessionId" class="text-xs text-base-content/50 mt-1">
          Selecione uma sessão para enviar mensagens
        </div>
      </div>

      <button
        :disabled="!canSend"
        @click="handleSendMessage"
        class="btn btn-primary btn-circle"
        :class="{
          'btn-disabled': !canSend
        }"
        :style="canSend ? { backgroundColor: toolColor } : {}"
      >
        <Icon name="heroicons:paper-airplane" class="h-5 w-5" />
      </button>
    </div>

    <div class="flex justify-center mt-2">
      <p class="text-xs text-base-content/40">
        Pressione Enter para enviar • Shift + Enter para nova linha
      </p>
    </div>
  </div>
</template>
