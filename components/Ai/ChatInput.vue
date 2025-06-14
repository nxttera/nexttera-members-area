<script setup lang="ts">
const emit = defineEmits<{
  send: [message: string]
}>()

const message = ref('')
const inputRef = ref<HTMLTextAreaElement>()

const handleSubmit = () => {
  if (message.value.trim()) {
    emit('send', message.value.trim())
    message.value = ''

    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.style.height = 'auto'
      }
    })
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const adjustHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 150)}px`
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex items-end gap-2">
    <div class="flex-grow relative">
      <textarea
        ref="inputRef"
        v-model="message"
        rows="1"
        @keydown="onKeydown"
        @input="adjustHeight"
        class="w-full resize-none overflow-hidden min-h-[50px] max-h-[150px] p-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base-content bg-base-200 border-base-300"
        placeholder="Digite sua mensagem..."
      ></textarea>

      <button
        type="submit"
        class="absolute right-2 bottom-2 btn btn-circle btn-sm text-base-content/70 hover:text-primary"
        :disabled="!message.trim()"
      >
        <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
      </button>
    </div>
  </form>
</template>

<style scoped>
textarea {
  line-height: 1.5;
}

textarea:focus {
  box-shadow: 0 0 0 2px hsla(var(--p) / 0.3);
}
</style>
