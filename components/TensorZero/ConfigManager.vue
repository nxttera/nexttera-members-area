<script setup lang="ts">
import type { TensorZeroModel, TensorZeroFunction } from '~/shared/types/tensorzero'

const {
  models,
  functions,
  isLoading,
  error,
  loadModels,
  loadFunctions,
  generateConfig,
  saveConfig
} = useTensorZero()

const showCreateModal = ref(false)
const activeTab = ref('models')
const generatedConfig = ref('')

const loadData = async () => {
  await Promise.all([loadModels(), loadFunctions()])
}

const handleGenerateConfig = async () => {
  try {
    generatedConfig.value = await generateConfig()
  } catch (err) {
    console.error('Erro ao gerar configuração:', err)
  }
}

const handleSaveConfig = async () => {
  if (!generatedConfig.value) {
    await handleGenerateConfig()
  }

  try {
    await saveConfig(generatedConfig.value)
    loggerInfo('Configuração salva com sucesso!')
  } catch (err) {
    console.error('Erro ao salvar configuração:', err)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Configuração TensorZero</h1>
      <div class="flex gap-2">
        <button @click="handleGenerateConfig" :disabled="isLoading" class="btn btn-secondary">
          <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
          Gerar Configuração
        </button>
        <button
          @click="handleSaveConfig"
          :disabled="isLoading || !generatedConfig"
          class="btn btn-primary"
        >
          <Icon name="heroicons:document-arrow-down" class="w-4 h-4" />
          Salvar TOML
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-error">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>

    <div class="tabs tabs-boxed">
      <a @click="activeTab = 'models'" :class="['tab', activeTab === 'models' && 'tab-active']">
        <Icon name="heroicons:cpu-chip" class="w-4 h-4 mr-2" />
        Modelos
      </a>
      <a
        @click="activeTab = 'functions'"
        :class="['tab', activeTab === 'functions' && 'tab-active']"
      >
        <Icon name="heroicons:puzzle-piece" class="w-4 h-4 mr-2" />
        Funções
      </a>
      <a @click="activeTab = 'config'" :class="['tab', activeTab === 'config' && 'tab-active']">
        <Icon name="heroicons:document-text" class="w-4 h-4 mr-2" />
        Configuração
      </a>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else>
      <div v-if="activeTab === 'models'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Modelos LLM</h2>
          <button class="btn btn-primary btn-sm">
            <Icon name="heroicons:plus" class="w-4 h-4" />
            Novo Modelo
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="model in models"
            :key="model.id"
            class="card bg-base-100 border border-base-300"
          >
            <div class="card-body">
              <div class="flex items-center justify-between">
                <h3 class="card-title text-sm">{{ model.name }}</h3>
                <div :class="['badge', model.is_active ? 'badge-success' : 'badge-error']">
                  {{ model.is_active ? 'Ativo' : 'Inativo' }}
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="opacity-70">Provider:</span>
                  <span class="font-mono">{{ model.provider }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="opacity-70">Tipo:</span>
                  <span class="font-mono">{{ model.model_type }}</span>
                </div>
                <div v-if="model.max_tokens" class="flex justify-between">
                  <span class="opacity-70">Max Tokens:</span>
                  <span>{{ model.max_tokens }}</span>
                </div>
                <div v-if="model.temperature" class="flex justify-between">
                  <span class="opacity-70">Temperature:</span>
                  <span>{{ model.temperature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'functions'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Funções</h2>
          <button class="btn btn-primary btn-sm">
            <Icon name="heroicons:plus" class="w-4 h-4" />
            Nova Função
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="func in functions"
            :key="func.id"
            class="card bg-base-100 border border-base-300"
          >
            <div class="card-body">
              <div class="flex items-center justify-between">
                <h3 class="card-title text-sm">{{ func.name }}</h3>
                <div :class="['badge', func.is_active ? 'badge-success' : 'badge-error']">
                  {{ func.is_active ? 'Ativo' : 'Inativo' }}
                </div>
              </div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="opacity-70">Tipo:</span>
                  <span class="font-mono">{{ func.type }}</span>
                </div>
                <div v-if="func.description" class="mt-2">
                  <span class="opacity-70">Descrição:</span>
                  <p class="text-xs mt-1">{{ func.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'config'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Configuração TOML</h2>
          <div class="flex gap-2">
            <button @click="handleGenerateConfig" class="btn btn-secondary btn-sm">
              <Icon name="heroicons:arrow-path" class="w-4 h-4" />
              Regenerar
            </button>
          </div>
        </div>

        <div class="mockup-code">
          <pre><code>{{ generatedConfig || 'Clique em "Gerar Configuração" para ver o TOML' }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
