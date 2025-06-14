<script setup lang="ts">
interface Props {
  tool: AiAgentTool
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
})

const emit = defineEmits<{
  startChat: [tool: AiAgentTool]
}>()

const categoryColors = {
  copywriting: 'text-purple-600 bg-purple-100',
  support: 'text-green-600 bg-green-100',
  sales: 'text-amber-600 bg-amber-100',
  analysis: 'text-blue-600 bg-blue-100',
  general: 'text-gray-600 bg-gray-100'
}

const categoryIcons = {
  copywriting: 'heroicons:pencil-square',
  support: 'heroicons:chat-bubble-left-right',
  sales: 'heroicons:currency-dollar',
  analysis: 'heroicons:chart-bar',
  general: 'heroicons:question-mark-circle'
}

const categoryLabels = {
  copywriting: 'Copywriting',
  support: 'Suporte',
  sales: 'Vendas',
  analysis: 'Análise',
  general: 'Geral'
}

const handleStartChat = () => {
  emit('startChat', props.tool)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<template>
  <div
    class="card bg-base-100 shadow-xl transition-all duration-200 hover:shadow-2xl border"
    :class="{ 'border-primary': featured, 'opacity-60': !tool.isAvailable }"
  >
    <div v-if="featured" class="absolute -top-3 left-4 z-10">
      <span class="badge badge-primary badge-sm font-medium">Destaque</span>
    </div>

    <div class="card-body">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: tool.config.customization.primaryColor + '20' }"
            >
              <Icon
                :name="categoryIcons[tool.category]"
                class="h-6 w-6"
                :style="{ color: tool.config.customization.primaryColor }"
              />
            </div>
          </div>
          <div>
            <h3 class="card-title text-base-content">{{ tool.name }}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="badge badge-sm font-medium" :class="categoryColors[tool.category]">
                {{ categoryLabels[tool.category] }}
              </span>
              <span
                class="badge badge-sm"
                :class="tool.isAvailable ? 'badge-success' : 'badge-warning'"
              >
                {{ tool.isAvailable ? 'Disponível' : 'Em breve' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p class="text-base-content/70 text-sm mb-4">{{ tool.description }}</p>

      <div class="space-y-3 mb-4">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="feature in tool.features.slice(0, 3)"
            :key="feature"
            class="badge badge-outline badge-xs"
          >
            {{ feature }}
          </span>
          <span v-if="tool.features.length > 3" class="badge badge-ghost badge-xs">
            +{{ tool.features.length - 3 }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="stat bg-base-200 rounded-lg p-2">
            <div class="stat-title text-xs">Categoria</div>
            <div class="stat-value text-xs">{{ categoryLabels[tool.category] }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-2">
            <div class="stat-title text-xs">Atualizado</div>
            <div class="stat-value text-xs">{{ formatDate(tool.updatedAt) }}</div>
          </div>
        </div>
      </div>

      <div class="card-actions justify-end">
        <button
          @click="handleStartChat"
          class="btn btn-primary btn-sm w-full"
          :disabled="!tool.isAvailable"
          :style="
            tool.isAvailable ? { backgroundColor: tool.config.customization.primaryColor } : {}
          "
        >
          <Icon name="heroicons:chat-bubble-left" class="h-4 w-4" />
          {{ tool.isAvailable ? 'Usar Ferramenta' : 'Em breve' }}
        </button>
      </div>
    </div>
  </div>
</template>
