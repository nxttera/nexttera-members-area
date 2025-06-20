<script setup lang="ts">
const LOGOUT_SUCCESS_MESSAGE = 'Logout realizado com sucesso!'
const LOGOUT_ERROR_MESSAGE = 'Erro ao realizar logout'
const LOGIN_ROUTE = '/login'
const DEFAULT_ROUTE = '/'

const { logout } = useAuth()
const { add: addToast } = useToast()

const isLoading = ref(true)

const performLogout = async (): Promise<void> => {
  try {
    await logout()
    addToast({
      title: LOGOUT_SUCCESS_MESSAGE,
      type: 'success'
    })
    await navigateTo(LOGIN_ROUTE)
  } catch (error) {
    loggerError('Logout error:', error)
    addToast({
      title: LOGOUT_ERROR_MESSAGE,
      type: 'error'
    })
    await navigateTo(DEFAULT_ROUTE)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await performLogout()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <div class="loading loading-spinner loading-lg text-primary" v-if="isLoading"></div>
        <h2 class="card-title text-lg">Desconectando...</h2>
        <p class="text-base-content/70">Aguarde um momento</p>
      </div>
    </div>
  </div>
</template>
