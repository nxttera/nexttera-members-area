<script setup lang="ts">
interface Props {
  tool: AiAgentTool
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true
})

const emit = defineEmits<{
  chatClosed: []
  openExternalChat: [url: string]
}>()

const closeChat = () => {
  emit('chatClosed')
}

const openExternalChat = () => {
  emit('openExternalChat', props.tool.webhookUrl)
}

const cssVariables = computed(() => ({
  '--chat--color-primary': props.tool.config.customization.primaryColor
}))
</script>

<template>
  <div v-show="isVisible" class="chat-widget-container" :style="cssVariables">
    <div class="chat-widget-header bg-base-200 p-4 rounded-t-lg border-b">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :style="{ backgroundColor: tool.config.customization.primaryColor + '20' }"
          >
            <Icon
              name="heroicons:cpu-chip"
              class="h-5 w-5"
              :style="{ color: tool.config.customization.primaryColor }"
            />
          </div>
          <div>
            <h3 class="font-semibold text-base-content">{{ tool.config.title }}</h3>
            <p class="text-xs text-base-content/70">{{ tool.config.subtitle }}</p>
          </div>
        </div>

        <button @click="closeChat" class="btn btn-ghost btn-sm btn-circle" title="Fechar chat">
          <Icon name="heroicons:x-mark" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="chat-widget-content bg-base-100 p-6 min-h-96">
      <div class="text-center py-8">
        <div
          class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          :style="{ backgroundColor: tool.config.customization.primaryColor + '10' }"
        >
          <Icon
            name="heroicons:cpu-chip"
            class="h-10 w-10"
            :style="{ color: tool.config.customization.primaryColor }"
          />
        </div>
        <h3 class="text-xl font-bold text-base-content mb-2">{{ tool.name }}</h3>
        <p class="text-base-content/70 mb-6">{{ tool.description }}</p>

        <div class="flex flex-wrap gap-2 justify-center mb-6">
          <span
            v-for="feature in tool.features.slice(0, 3)"
            :key="feature"
            class="badge badge-outline text-xs"
            :style="{ borderColor: tool.config.customization.primaryColor }"
          >
            {{ feature }}
          </span>
          <span v-if="tool.features.length > 3" class="badge badge-ghost text-xs">
            +{{ tool.features.length - 3 }} recursos
          </span>
        </div>

        <button
          @click="openExternalChat"
          class="btn btn-primary btn-lg"
          :style="{ backgroundColor: tool.config.customization.primaryColor }"
        >
          <Icon name="heroicons:chat-bubble-left" class="h-5 w-5" />
          Iniciar Conversa
        </button>

        <p class="text-xs text-base-content/50 mt-4">
          Será aberto em uma nova janela para melhor experiência
        </p>
      </div>
    </div>

    <div class="chat-widget-footer bg-base-200/50 p-3 rounded-b-lg text-center">
      <p class="text-xs text-base-content/50">Powered by Nexttera AI Tools</p>
    </div>
  </div>
</template>

<style scoped>
/* .chat-widget-container {
  @apply bg-base-100 rounded-lg shadow-xl overflow-hidden max-w-md w-full;
}

.chat-widget-content {
  @apply relative;
} */
</style>
