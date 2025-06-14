<script setup lang="ts">
import type { TensorZeroSaveConfigRequest } from '~/shared/types/tensorzero'

interface Props {
  disabled?: boolean
  generateFile?: boolean
  filePath?: string
}

interface Emits {
  saved: [result: any]
  error: [error: string]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  generateFile: true,
  filePath: 'tensorzero/tensorzero.toml'
})

const emit = defineEmits<Emits>()

const { saveConfigToDatabase, isLoading, error } = useTensorZero()
const user = useSupabaseUser()

const isFormOpen = ref(false)

watch(
  user,
  newUser => {
    if (newUser) {
      console.log('Usuário carregado:', newUser.id)
    }
  },
  { immediate: true }
)
const configForm = ref({
  functionName: '',
  functionType: 'chat' as const,
  functionDescription: '',
  variantName: '',
  variantType: 'chat_completion' as const,
  modelName: '',
  weight: 1,
  systemPrompt: '',
  userPrompt: '',
  jsonSchema: ''
})

const availableModels = ref([
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o',
  'gpt-4o-mini',
  'o1',
  'o1-mini',
  'o3',
  'o3-mini',
  'o4-mini',
  'o4-mini-high',
  'claude-opus-4',
  'claude-sonnet-4',
  'claude-3-7-sonnet'
])

const functionTypes = [
  { value: 'chat', label: 'Chat' },
  { value: 'json', label: 'JSON' }
]

const variantTypes = [{ value: 'chat_completion', label: 'Chat Completion' }]

const resetForm = () => {
  configForm.value = {
    functionName: '',
    functionType: 'chat',
    functionDescription: '',
    variantName: '',
    variantType: 'chat_completion',
    modelName: '',
    weight: 1,
    systemPrompt: '',
    userPrompt: '',
    jsonSchema: ''
  }
}

const validateForm = () => {
  const errors = []

  if (!configForm.value.functionName.trim()) {
    errors.push('Nome da função é obrigatório')
  }

  if (!configForm.value.variantName.trim()) {
    errors.push('Nome da variante é obrigatório')
  }

  if (!configForm.value.modelName) {
    errors.push('Modelo é obrigatório')
  }

  if (configForm.value.weight < 1) {
    errors.push('Peso deve ser maior que 0')
  }

  if (configForm.value.jsonSchema) {
    try {
      JSON.parse(configForm.value.jsonSchema)
    } catch {
      errors.push('JSON Schema deve ser um JSON válido')
    }
  }

  return errors
}

const handleSave = async () => {
  if (!user.value || !user.value.id) {
    emit('error', 'Usuário não autenticado')
    return
  }

  const validationErrors = validateForm()
  if (validationErrors.length > 0) {
    emit('error', validationErrors.join(', '))
    return
  }

  try {
    const configData: TensorZeroSaveConfigRequest = {
      functions: [
        {
          name: configForm.value.functionName,
          type: configForm.value.functionType,
          description: configForm.value.functionDescription || undefined
        }
      ],
      variants: [
        {
          function_name: configForm.value.functionName,
          name: configForm.value.variantName,
          type: configForm.value.variantType,
          model_name: configForm.value.modelName,
          weight: configForm.value.weight,
          system_prompt: configForm.value.systemPrompt || undefined,
          user_prompt: configForm.value.userPrompt || undefined,
          json_schema: configForm.value.jsonSchema
            ? JSON.parse(configForm.value.jsonSchema)
            : undefined
        }
      ],
      userId: user.value.id,
      generateFile: props.generateFile,
      filePath: props.filePath
    }

    const result = await saveConfigToDatabase(configData)
    emit('saved', result)
    resetForm()
    isFormOpen.value = false
  } catch (err: any) {
    emit('error', err.message || 'Erro ao salvar configuração')
  }
}

const openForm = () => {
  resetForm()
  isFormOpen.value = true
}

const closeForm = () => {
  isFormOpen.value = false
  resetForm()
}
</script>

<template>
  <div class="space-y-4">
    <button @click="openForm" :disabled="disabled || isLoading || !user" class="btn btn-primary">
      <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
      Nova Configuração TensorZero
    </button>

    <div v-if="error" class="alert alert-error">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
      <span>{{ error }}</span>
    </div>

    <div v-if="!user" class="alert alert-warning">
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
      <span>Aguardando autenticação do usuário...</span>
    </div>

    <!-- Modal de Criação -->
    <div
      v-if="isFormOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-base-100 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Nova Configuração TensorZero</h2>
            <button @click="closeForm" class="btn btn-ghost btn-sm">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="space-y-6">
            <!-- Seção da Função -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg mb-4">Configuração da Função</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Nome da Função *</span>
                    </label>
                    <input
                      v-model="configForm.functionName"
                      type="text"
                      placeholder="ex: generate_content"
                      class="input input-bordered"
                    />
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Tipo da Função *</span>
                    </label>
                    <select v-model="configForm.functionType" class="select select-bordered">
                      <option v-for="type in functionTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Descrição da Função</span>
                  </label>
                  <textarea
                    v-model="configForm.functionDescription"
                    placeholder="Descreva o propósito desta função..."
                    class="textarea textarea-bordered"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Seção da Variante -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg mb-4">Configuração da Variante</h3>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Nome da Variante *</span>
                    </label>
                    <input
                      v-model="configForm.variantName"
                      type="text"
                      placeholder="ex: default"
                      class="input input-bordered"
                    />
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Tipo da Variante *</span>
                    </label>
                    <select v-model="configForm.variantType" class="select select-bordered">
                      <option v-for="type in variantTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                      </option>
                    </select>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Peso</span>
                    </label>
                    <input
                      v-model.number="configForm.weight"
                      type="number"
                      min="1"
                      class="input input-bordered"
                    />
                  </div>
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Modelo *</span>
                  </label>
                  <select v-model="configForm.modelName" class="select select-bordered">
                    <option value="">Selecione um modelo</option>
                    <option v-for="model in availableModels" :key="model" :value="model">
                      {{ model }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Seção de Prompts -->
            <div class="card bg-base-200">
              <div class="card-body">
                <h3 class="card-title text-lg mb-4">Prompts</h3>

                <div class="space-y-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">System Prompt</span>
                    </label>
                    <textarea
                      v-model="configForm.systemPrompt"
                      placeholder="Instruções para o sistema..."
                      class="textarea textarea-bordered"
                      rows="4"
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">User Prompt</span>
                    </label>
                    <textarea
                      v-model="configForm.userPrompt"
                      placeholder="Template do prompt do usuário..."
                      class="textarea textarea-bordered"
                      rows="4"
                    ></textarea>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">JSON Schema</span>
                    </label>
                    <textarea
                      v-model="configForm.jsonSchema"
                      placeholder='{"type": "object", "properties": {...}}'
                      class="textarea textarea-bordered font-mono text-sm"
                      rows="6"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex justify-end gap-3">
              <button type="button" @click="closeForm" class="btn btn-ghost">Cancelar</button>
              <button type="submit" :disabled="isLoading || !user" class="btn btn-primary">
                <span v-if="isLoading" class="loading loading-spinner loading-sm mr-2"></span>
                {{ isLoading ? 'Salvando...' : 'Salvar Configuração' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
