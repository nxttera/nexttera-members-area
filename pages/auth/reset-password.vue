<script setup lang="ts">
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient<Database>()
const route = useRoute()

const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  password: '',
  confirmPassword: ''
})

const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
  errors.password = ''
  errors.confirmPassword = ''
}

const validatePasswords = (): boolean => {
  clearMessages()

  if (passwordForm.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
    return false
  }

  if (passwordForm.password !== passwordForm.confirmPassword) {
    errors.confirmPassword = 'Senhas não coincidem'
    return false
  }

  return true
}

const handlePasswordReset = async () => {
  if (!validatePasswords()) {
    return
  }

  isLoading.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.password
    })

    if (error) {
      throw new Error(error.message)
    }

    successMessage.value = 'Senha atualizada com sucesso!'

    setTimeout(() => {
      navigateTo('/dashboard')
    }, 2000)
  } catch {
    errorMessage.value = 'Erro ao atualizar senha. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const accessToken = route.query.access_token as string
  const refreshToken = route.query.refresh_token as string

  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-base-content">Redefinir Senha</h1>
          <p class="text-base-content/70 mt-2">Digite sua nova senha</p>
        </div>

        <form class="space-y-4" @submit.prevent="handlePasswordReset">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nova Senha</span>
            </label>
            <input
              v-model="passwordForm.password"
              type="password"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.password }"
              placeholder="Digite sua nova senha"
              required
            />
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirmar Nova Senha</span>
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="input input-bordered w-full"
              :class="{ 'input-error': errors.confirmPassword }"
              placeholder="Confirme sua nova senha"
              required
            />
            <label v-if="errors.confirmPassword" class="label">
              <span class="label-text-alt text-error">{{ errors.confirmPassword }}</span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              class="btn btn-primary"
              :class="{ loading: isLoading }"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Atualizando...' : 'Atualizar Senha' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <NuxtLink to="/login" class="btn btn-ghost btn-sm"> Voltar ao login </NuxtLink>
        </div>

        <div v-if="successMessage" class="alert alert-success mt-4">
          <span>{{ successMessage }}</span>
        </div>

        <div v-if="errorMessage" class="alert alert-error mt-4">
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
