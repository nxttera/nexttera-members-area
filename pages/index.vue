<script setup lang="ts">
definePageMeta({
  title: 'Home'
})

const features = [
  {
    icon: 'heroicons:chart-bar',
    title: 'Analytics Avançadas',
    description: 'Insights profundos sobre performance de vendas e métricas de receita'
  },
  {
    icon: 'heroicons:funnel',
    title: 'Gestão de Pipeline',
    description: 'Visualize e otimize seu funil de vendas com ferramentas intuitivas'
  },
  {
    icon: 'heroicons:cog-6-tooth',
    title: 'Automação Inteligente',
    description: 'Automatize workflows e processos para aumentar eficiência'
  },
  {
    icon: 'heroicons:currency-dollar',
    title: 'Tracking de Receita',
    description: 'Monitore receita em tempo real e preveja crescimento futuro'
  }
]

const stats = [
  { value: '150%', label: 'Aumento em Conversões' },
  { value: '2.5x', label: 'ROI em Vendas' },
  { value: '45min', label: 'Economia por Dia' },
  { value: '99.9%', label: 'Uptime Garantido' }
]
</script>

<template>
  <div>
    <section class="hero min-h-96 bg-gradient-to-br from-primary/20 to-secondary/20">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-6xl font-bold text-base-content mb-6">
            Revolucione Suas
            <span class="text-primary">Operações de Receita</span>
          </h1>
          <p class="text-xl text-base-content/70 mb-8 max-w-2xl mx-auto">
            Plataforma completa de RevOps que unifica vendas, marketing e customer success para
            acelerar seu crescimento sustentável
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/dashboard" class="btn btn-primary btn-lg">
              <Icon name="heroicons:rocket-launch" class="h-5 w-5" />
              Começar Agora
            </NuxtLink>
            <button class="btn btn-outline btn-lg">
              <Icon name="heroicons:play" class="h-5 w-5" />
              Ver Demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
          <div v-for="stat in stats" :key="stat.label" class="stat">
            <div class="stat-value text-primary">{{ stat.value }}</div>
            <div class="stat-desc">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-base-content mb-4">
            Tudo Que Você Precisa Para Crescer
          </h2>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            Ferramentas poderosas e insights acionáveis para otimizar cada etapa do seu processo de
            receita
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="card bg-base-100 shadow-xl">
            <div class="card-body text-center">
              <div class="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                <Icon :name="feature.icon" class="h-8 w-8 text-primary" />
              </div>
              <h3 class="card-title justify-center text-lg">{{ feature.title }}</h3>
              <p class="text-base-content/70">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-base-content mb-8">
          Pronto Para Transformar Sua Receita?
        </h2>
        <p class="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
          Junte-se a centenas de empresas que já otimizaram seus processos com nossa plataforma
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/dashboard" class="btn btn-primary btn-lg">
            Começar Gratuitamente
          </NuxtLink>
          <NuxtLink to="/contact" class="btn btn-outline btn-lg"> Falar com Especialista </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
