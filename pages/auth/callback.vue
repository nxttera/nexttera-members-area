<script setup lang="ts">
definePageMeta({
  layout: false
})

const user = useSupabaseUser()
const redirectInfo = useSupabaseCookieRedirect()

watch(
  user,
  () => {
    if (user.value) {
      const redirectPath = redirectInfo.pluck()
      navigateTo(redirectPath || '/dashboard')
    }
  },
  { immediate: true }
)

onMounted(() => {
  setTimeout(() => {
    if (!user.value) {
      navigateTo('/login')
    }
  }, 5000)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body text-center">
        <div class="loading loading-spinner loading-lg text-primary" />
        <h2 class="text-xl font-semibold mt-4">Confirmando login...</h2>
        <p class="text-base-content/70">Aguarde enquanto processamos sua autenticação</p>
      </div>
    </div>
  </div>
</template>
