<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { functions, variants, loadFunctions, loadVariants, isLoading, error } = useTensorZero()

const successMessage = ref('')
const errorMessage = ref('')

const handleConfigSaved = (result: any) => {
  successMessage.value = 'Configuração TensorZero salva com sucesso!'

  if (result.data?.tomlContent) {
    loggerInfo('Arquivo TOML gerado:', result.data.filePath)
  }

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)

  loadFunctions()
  loadVariants()
}

const handleError = (message: string) => {
  errorMessage.value = message

  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

onMounted(() => {
  loadFunctions()
  loadVariants()
})
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Configurações TensorZero</h1>
        <p class="text-base-content/70">
          Gerencie funções e variantes do TensorZero. As configurações são salvas no banco de dados
          e o arquivo <code class="bg-base-200 px-2 py-1 rounded">tensorzero.toml</code> é gerado
          automaticamente.
        </p>
      </div>

      <!-- Alertas -->
      <div class="space-y-4 mb-6">
        <div v-if="successMessage" class="alert alert-success">
          <Icon name="heroicons:check-circle" class="w-5 h-5" />
          <span>{{ successMessage }}</span>
        </div>

        <div v-if="errorMessage" class="alert alert-error">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
          <span>{{ errorMessage }}</span>
        </div>

        <div v-if="error" class="alert alert-error">
          <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Formulário de Nova Configuração -->
      <div class="card bg-base-100 shadow-xl mb-8">
        <div class="card-body">
          <h2 class="card-title text-xl mb-4">
            <Icon name="heroicons:plus-circle" class="w-6 h-6" />
            Criar Nova Configuração
          </h2>

          <TensorZeroConfigSaver
            @saved="handleConfigSaved"
            @error="handleError"
            :generate-file="true"
            file-path="tensorzero/tensorzero.toml"
          />
        </div>
      </div>

      <!-- Lista de Configurações Existentes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Funções -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">
              <Icon name="heroicons:code-bracket" class="w-6 h-6" />
              Funções Registradas
              <div class="badge badge-primary">{{ functions.length }}</div>
            </h2>

            <div v-if="isLoading" class="flex justify-center p-8">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else-if="functions.length === 0" class="text-center p-8 text-base-content/50">
              <Icon name="heroicons:inbox" class="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma função registrada ainda</p>
              <p class="text-sm">Crie sua primeira configuração acima</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="func in functions"
                :key="func.id"
                class="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-semibold text-lg">{{ func.name }}</h3>
                  <div class="flex gap-2">
                    <div class="badge badge-outline">{{ func.type }}</div>
                    <div v-if="func.is_active" class="badge badge-success badge-outline">Ativo</div>
                    <div v-else class="badge badge-error badge-outline">Inativo</div>
                  </div>
                </div>

                <p v-if="func.description" class="text-sm text-base-content/70 mb-2">
                  {{ func.description }}
                </p>

                <div class="text-xs text-base-content/50">
                  Criado em: {{ new Date(func.created_at).toLocaleDateString('pt-BR') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Variantes -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-xl mb-4">
              <Icon name="heroicons:adjustments-horizontal" class="w-6 h-6" />
              Variantes Registradas
              <div class="badge badge-secondary">{{ variants.length }}</div>
            </h2>

            <div v-if="isLoading" class="flex justify-center p-8">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else-if="variants.length === 0" class="text-center p-8 text-base-content/50">
              <Icon name="heroicons:inbox" class="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma variante registrada ainda</p>
              <p class="text-sm">Crie sua primeira configuração acima</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="variant in variants"
                :key="variant.id"
                class="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors"
              >
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-semibold">{{ variant.name }}</h3>
                  <div class="flex gap-2">
                    <div class="badge badge-outline">{{ variant.type }}</div>
                    <div class="badge badge-info badge-outline">Peso: {{ variant.weight }}</div>
                    <div v-if="variant.is_active" class="badge badge-success badge-outline">
                      Ativo
                    </div>
                    <div v-else class="badge badge-error badge-outline">Inativo</div>
                  </div>
                </div>

                <div class="text-sm space-y-1">
                  <div v-if="variant.system_prompt" class="truncate">
                    <span class="font-medium">System:</span>
                    <span class="text-base-content/70"
                      >{{ variant.system_prompt.substring(0, 100) }}...</span
                    >
                  </div>

                  <div v-if="variant.user_prompt" class="truncate">
                    <span class="font-medium">User:</span>
                    <span class="text-base-content/70"
                      >{{ variant.user_prompt.substring(0, 100) }}...</span
                    >
                  </div>
                </div>

                <div class="text-xs text-base-content/50 mt-2">
                  Criado em: {{ new Date(variant.created_at).toLocaleDateString('pt-BR') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações Adicionais -->
      <div class="card bg-base-200 shadow-xl mt-8">
        <div class="card-body">
          <h2 class="card-title text-lg mb-4">
            <Icon name="heroicons:information-circle" class="w-5 h-5" />
            Como Funciona
          </h2>

          <div class="prose prose-sm max-w-none">
            <ul>
              <li>
                <strong>Funções:</strong> Definem o tipo de tarefa que o TensorZero irá executar
                (chat, json)
              </li>
              <li>
                <strong>Variantes:</strong> Configurações específicas para cada função, incluindo
                modelo, prompts e pesos
              </li>
              <li>
                <strong>Arquivo TOML:</strong> Gerado automaticamente com base nas configurações do
                banco de dados
              </li>
              <li>
                <strong>Modelos:</strong> Pre-configurados no sistema com os modelos mais recentes
                da OpenAI e Anthropic
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
