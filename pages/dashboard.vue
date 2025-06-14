<script setup lang="ts">
definePageMeta({
  middleware: 'onboarding'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { userProfile, isLoading, error } = useUserProfile()

const userInitials = computed(() => {
  if (userProfile.value?.name) {
    return userProfile.value.name.charAt(0).toUpperCase()
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
})

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/login')
  } catch (error: unknown) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Dashboard</h1>
        <p class="text-base-content/70 mt-2">Bem-vindo à plataforma RevOps</p>
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div
            class="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center"
          >
            {{ userInitials }}
          </div>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a class="text-error" @click="handleLogout">
              <Icon name="heroicons:arrow-right-start-on-rectangle" class="w-4 h-4" />
              Sair
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-primary">
            <Icon name="heroicons:chart-bar" class="w-6 h-6" />
            Analytics
          </h2>
          <p class="text-base-content/70">Visualize suas métricas de vendas</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary btn-sm">Ver Relatórios</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-secondary">
            <Icon name="heroicons:users" class="w-6 h-6" />
            Leads
          </h2>
          <p class="text-base-content/70">Gerencie seus prospects</p>
          <div class="card-actions justify-end">
            <button class="btn btn-secondary btn-sm">Gerenciar</button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-accent">
            <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
            Configurações
          </h2>
          <p class="text-base-content/70">Ajuste suas preferências</p>
          <div class="card-actions justify-end">
            <button class="btn btn-accent btn-sm">Configurar</button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <h2 class="card-title">Informações da Conta</h2>
            <div v-if="isLoading" class="loading loading-spinner loading-sm"></div>
          </div>

          <div v-if="error" class="alert alert-error mt-4">
            <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
            <span>{{ error }}</span>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <span class="text-sm text-base-content/70">Nome:</span>
              <p class="font-medium">{{ userProfile?.name || 'Não informado' }}</p>
            </div>
            <div>
              <span class="text-sm text-base-content/70">Email:</span>
              <p class="font-medium">{{ userProfile?.email || user?.email }}</p>
            </div>
            <div>
              <span class="text-sm text-base-content/70">Telefone:</span>
              <p class="font-medium">{{ userProfile?.phone || 'Não informado' }}</p>
            </div>
            <div>
              <span class="text-sm text-base-content/70">Empresa:</span>
              <p class="font-medium">{{ userProfile?.company || 'Não informado' }}</p>
            </div>
            <div>
              <span class="text-sm text-base-content/70">Status:</span>
              <div class="badge" :class="userProfile?.is_active ? 'badge-success' : 'badge-error'">
                {{ userProfile?.is_active ? 'Ativo' : 'Inativo' }}
              </div>
            </div>
            <div>
              <span class="text-sm text-base-content/70">Criado em:</span>
              <p class="font-medium">{{ formatDate(userProfile?.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
