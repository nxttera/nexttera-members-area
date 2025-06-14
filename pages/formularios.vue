<script setup lang="ts">
definePageMeta({
  title: 'Formulários',
  layout: 'default'
})

const formularios = [
  {
    id: 1,
    titulo: 'Cadastro de Lead',
    descricao: 'Formulário para captura de novos leads',
    status: 'ativo',
    respostas: 156,
    ultimaAtualizacao: '2024-01-15'
  },
  {
    id: 2,
    titulo: 'Pesquisa de Satisfação',
    descricao: 'Avaliação da experiência do cliente',
    status: 'ativo',
    respostas: 89,
    ultimaAtualizacao: '2024-01-10'
  },
  {
    id: 3,
    titulo: 'Feedback de Produto',
    descricao: 'Coleta de opiniões sobre nossos serviços',
    status: 'inativo',
    respostas: 42,
    ultimaAtualizacao: '2024-01-05'
  }
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content">Formulários</h1>
        <p class="text-base-content/70 mt-1">Gerencie seus formulários de captação e pesquisa</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="h-4 w-4" />
        Novo Formulário
      </button>
    </div>

    <div class="stats shadow w-full">
      <div class="stat">
        <div class="stat-figure text-primary">
          <Icon name="heroicons:document-text" class="h-8 w-8" />
        </div>
        <div class="stat-title">Total de Formulários</div>
        <div class="stat-value text-primary">{{ formularios.length }}</div>
        <div class="stat-desc">{{ formularios.filter(f => f.status === 'ativo').length }} ativos</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <Icon name="heroicons:chart-bar" class="h-8 w-8" />
        </div>
        <div class="stat-title">Total de Respostas</div>
        <div class="stat-value text-secondary">{{ formularios.reduce((acc, f) => acc + f.respostas, 0) }}</div>
        <div class="stat-desc">Este mês</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="formulario in formularios"
        :key="formulario.id"
        class="card bg-base-100 shadow-xl"
      >
        <div class="card-body">
          <div class="flex items-start justify-between">
            <h2 class="card-title text-base-content">{{ formulario.titulo }}</h2>
            <div class="badge" :class="formulario.status === 'ativo' ? 'badge-success' : 'badge-warning'">
              {{ formulario.status }}
            </div>
          </div>
          
          <p class="text-base-content/70">{{ formulario.descricao }}</p>
          
          <div class="stats stats-vertical bg-base-200 shadow">
            <div class="stat">
              <div class="stat-title">Respostas</div>
              <div class="stat-value text-sm">{{ formulario.respostas }}</div>
            </div>
            <div class="stat">
              <div class="stat-title">Última Atualização</div>
              <div class="stat-value text-sm">{{ new Date(formulario.ultimaAtualizacao).toLocaleDateString('pt-BR') }}</div>
            </div>
          </div>
          
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-ghost btn-sm">
              <Icon name="heroicons:eye" class="h-4 w-4" />
              Visualizar
            </button>
            <button class="btn btn-primary btn-sm">
              <Icon name="heroicons:pencil" class="h-4 w-4" />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Ações Rápidas</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button class="btn btn-outline">
            <Icon name="heroicons:document-duplicate" class="h-4 w-4" />
            Duplicar Formulário
          </button>
          <button class="btn btn-outline">
            <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
            Exportar Respostas
          </button>
          <button class="btn btn-outline">
            <Icon name="heroicons:chart-pie" class="h-4 w-4" />
            Relatório Completo
          </button>
          <button class="btn btn-outline">
            <Icon name="heroicons:cog-6-tooth" class="h-4 w-4" />
            Configurações
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 