# Plano de Implementação - Sistema Gamificado de Posicionamento de Marca

## 🎯 Visão Geral

Sistema gamificado para responder as perguntas do documento "Guia do Posicionamento de Marca e Mercado" de forma estruturada e envolvente, com mecânicas de RPG simplificadas.

## 🏗️ Arquitetura Técnica

### Estrutura de Dados (Supabase)

#### Tabelas Principais

**1. `brand_positioning_sessions`**

```sql
- id: uuid (PK)
- user_id: uuid (FK -> auth.users)
- title: text
- status: enum ('draft', 'in_progress', 'completed')
- current_chapter: integer (1-6)
- current_mission: integer
- total_progress: integer (0-100)
- completed_at: timestamptz
- created_at: timestamptz
- updated_at: timestamptz
```

**2. `chapters`** (dados estáticos/seed)

```sql
- id: integer (PK)
- title: text
- description: text
- icon: text
- order_number: integer
- total_missions: integer
- reward_title: text
```

**3. `missions`** (dados estáticos/seed)

```sql
- id: integer (PK)
- chapter_id: integer (FK -> chapters)
- title: text
- description: text
- order_number: integer
- total_questions: integer
```

**4. `questions`** (dados estáticos/seed)

```sql
- id: integer (PK)
- mission_id: integer (FK -> missions)
- text: text
- description: text (tooltip/dica contextual)
- question_type: enum ('text', 'textarea', 'select', 'multi_select')
- options: json (para selects - ex: ["Produto físico", "Serviço digital", "SaaS", "Consultoria"])
- is_required: boolean
- order_number: integer
```

**5. `session_answers`**

```sql
- id: uuid (PK)
- session_id: uuid (FK -> brand_positioning_sessions)
- question_id: integer (FK -> questions)
- answer: text
- answered_at: timestamptz
```

**6. `session_progress`**

```sql
- id: uuid (PK)
- session_id: uuid (FK -> brand_positioning_sessions)
- chapter_id: integer (FK -> chapters)
- mission_id: integer (FK -> missions)
- is_chapter_completed: boolean
- is_mission_completed: boolean
- completed_at: timestamptz
```

### Migrations

**Migration 1: Estrutura Base**

```sql
-- Criar enums
CREATE TYPE session_status AS ENUM ('draft', 'in_progress', 'completed');
CREATE TYPE question_type AS ENUM ('text', 'textarea', 'select', 'multi_select');

-- Tabelas principais
CREATE TABLE chapters (...);
CREATE TABLE missions (...);
CREATE TABLE questions (...);
CREATE TABLE brand_positioning_sessions (...);
CREATE TABLE session_answers (...);
CREATE TABLE session_progress (...);

-- Indexes para performance
CREATE INDEX idx_sessions_user_id ON brand_positioning_sessions(user_id);
CREATE INDEX idx_answers_session_id ON session_answers(session_id);
CREATE INDEX idx_progress_session_id ON session_progress(session_id);
```

**Migration 2: Dados Estáticos (Seed)**

```sql
-- Inserir os 6 capítulos
INSERT INTO chapters (id, title, description, icon, order_number, total_missions, reward_title) VALUES
(1, 'História & Credo', 'Descubra as origens e crenças da sua marca', '📖', 1, 5, 'Guardião da História'),
(2, 'Proposta de Valor', 'Defina ofertas, ganhos e dores resolvidas', '💎', 2, 3, 'Mestre do Valor'),
-- ... outros capítulos

-- Inserir missões (exemplo Capítulo 1)
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(1, 1, 'Origens', 'História de origem e motivações iniciais', 1, 8),
(2, 1, 'O Grande Desafio', 'Obstáculos e epifanias transformadoras', 2, 6),
-- ... outras missões

-- Inserir perguntas (extraídas do documento)
INSERT INTO questions (mission_id, text, description, question_type, options, is_required, order_number) VALUES
(1, 'Qual era a situação antes de você iniciar sua jornada?', 'Descreva as circunstâncias do dia a dia', 'textarea', null, true, 1),
(1, 'Qual é o seu tipo de negócio principal?', 'Selecione a categoria que melhor descreve sua oferta', 'select', '["Produto físico", "Serviço digital", "SaaS", "Consultoria", "E-commerce", "Infoproduto"]', true, 2),
(1, 'Quais canais você já utiliza?', 'Marque todos os canais que você já testou', 'multi_select', '["Instagram", "Facebook", "LinkedIn", "YouTube", "Google Ads", "SEO", "Email Marketing", "Influenciadores"]', false, 3),
-- ... outras perguntas
```

## 🔄 Fluxo de Dados

```
Components → Composables → Stores → APIs → Services → Supabase
```

## 📁 Estrutura de Arquivos

```
/shared/types/
├── brand-positioning.ts    # Tipos específicos do sistema
└── index.ts               # Export dos tipos

/server/api/brand-positioning/
├── sessions/
│   ├── index.get.ts       # GET /api/brand-positioning/sessions (listar sessões do usuário)
│   ├── index.post.ts      # POST /api/brand-positioning/sessions (criar nova sessão)
│   └── [id]/
│       ├── index.get.ts   # GET session específica
│       ├── answers.post.ts # POST salvar respostas
│       └── progress.post.ts # POST atualizar progresso
├── chapters.get.ts        # GET /api/brand-positioning/chapters
├── missions/
│   └── [chapterId].get.ts # GET missions de um capítulo
└── questions/
    └── [missionId].get.ts # GET questions de uma missão

/server/services/
└── brandPositioningService.ts

/middleware/
└── brand-positioning-auth.ts # Middleware para verificar se usuário é master

/stores/
└── brandPositioning.ts

/composables/
├── useBrandPositioning.ts
├── useBrandPositioningSessions.ts
└── useBrandPositioningProgress.ts

/components/BrandPositioning/
├── UI/
│   ├── ProgressSidebar.vue
│   ├── ChapterMap.vue
│   ├── MissionCard.vue
│   └── QuestionForm.vue
├── Forms/
│   ├── TextQuestion.vue
│   ├── TextareaQuestion.vue
│   ├── SelectQuestion.vue
│   └── MultiSelectQuestion.vue
└── Layout/
    └── GameContainer.vue

/pages/brand-positioning/
├── index.vue              # Lista de sessões
├── new.vue               # Criar nova sessão
└── [sessionId]/
    ├── index.vue         # Dashboard da sessão
    └── chapter/
        └── [chapterId]/
            └── mission/
                └── [missionId].vue # Formulário da missão
```

## 🎮 Componentes Principais

### 1. Layout Container

```vue
<!-- components/BrandPositioning/Layout/GameContainer.vue -->
<template>
  <div class="flex h-screen bg-base-100">
    <!-- Sidebar com progresso -->
    <BrandPositioningUIProgressSidebar
      :session="currentSession"
      :chapters="chapters"
      :current-chapter="currentChapter"
      class="w-80 border-r border-base-300"
    />

    <!-- Conteúdo principal -->
    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>
```

### 2. Sidebar de Progresso

```vue
<!-- components/BrandPositioning/UI/ProgressSidebar.vue -->
<template>
  <div class="p-6 bg-base-200 h-full">
    <!-- Progresso global -->
    <div class="mb-8">
      <h3 class="font-bold text-lg mb-2">Jornada do Posicionamento</h3>
      <progress
        class="progress progress-primary w-full"
        :value="session?.total_progress"
        max="100"
      />
      <span class="text-sm text-base-content/70"> {{ session?.total_progress }}% completo </span>
    </div>

    <!-- Mapa de capítulos -->
    <BrandPositioningUIChapterMap
      :chapters="chapters"
      :current-chapter="currentChapter"
      :session="session"
      @chapter-click="onChapterClick"
    />
  </div>
</template>
```

### 3. Mapa de Capítulos (RPG Style)

```vue
<!-- components/BrandPositioning/UI/ChapterMap.vue -->
<template>
  <div class="space-y-4">
    <div
      v-for="chapter in chapters"
      :key="chapter.id"
      class="chapter-node"
      :class="{
        completed: isChapterCompleted(chapter.id),
        current: currentChapter?.id === chapter.id,
        locked: isChapterLocked(chapter.id)
      }"
      @click="$emit('chapter-click', chapter)"
    >
      <div class="flex items-center gap-3 p-4 rounded-lg border transition-all">
        <div class="text-2xl">{{ chapter.icon }}</div>
        <div class="flex-1">
          <h4 class="font-semibold">{{ chapter.title }}</h4>
          <p class="text-sm text-base-content/70">{{ chapter.description }}</p>

          <!-- Progresso do capítulo -->
          <progress
            class="progress progress-xs mt-2"
            :value="getChapterProgress(chapter.id)"
            max="100"
          />
        </div>

        <!-- Status/Badge -->
        <div v-if="isChapterCompleted(chapter.id)" class="badge badge-success">
          👑 {{ chapter.reward_title }}
        </div>
        <div v-else-if="currentChapter?.id === chapter.id" class="badge badge-primary">Atual</div>
      </div>
    </div>
  </div>
</template>
```

### 4. Formulário de Questões

```vue
<!-- components/BrandPositioning/UI/QuestionForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-for="question in questions" :key="question.id" class="question-group">
      <!-- Componentes específicos por tipo -->
      <BrandPositioningFormsTextQuestion
        v-if="question.question_type === 'text'"
        :question="question"
        :model-value="answers[question.id]"
        @update:model-value="updateAnswer(question.id, $event)"
      />

      <BrandPositioningFormsTextareaQuestion
        v-else-if="question.question_type === 'textarea'"
        :question="question"
        :model-value="answers[question.id]"
        @update:model-value="updateAnswer(question.id, $event)"
      />

      <BrandPositioningFormsSelectQuestion
        v-else-if="question.question_type === 'select'"
        :question="question"
        :model-value="answers[question.id]"
        @update:model-value="updateAnswer(question.id, $event)"
      />

      <BrandPositioningFormsMultiSelectQuestion
        v-else-if="question.question_type === 'multi_select'"
        :question="question"
        :model-value="answers[question.id]"
        @update:model-value="updateAnswer(question.id, $event)"
      />
    </div>

    <!-- Actions -->
    <div class="flex justify-between pt-6">
      <button type="button" class="btn btn-ghost" @click="$emit('previous')">Anterior</button>

      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
        {{ isLastMission ? 'Finalizar Capítulo' : 'Próxima Missão' }}
      </button>
    </div>
  </form>
</template>
```

### 5. Componente SelectQuestion

```vue
<!-- components/BrandPositioning/Forms/SelectQuestion.vue -->
<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text font-semibold">
        {{ question.text }}
        <span v-if="question.is_required" class="text-error">*</span>
      </span>
      <div
        v-if="question.description"
        class="tooltip tooltip-left"
        :data-tip="question.description"
      >
        <Icon name="heroicons:information-circle" class="w-4 h-4 text-base-content/60" />
      </div>
    </label>

    <select
      :value="modelValue"
      @change="$emit('update:model-value', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full"
      :class="{ 'select-error': question.is_required && !modelValue }"
    >
      <option value="">Selecione uma opção</option>
      <option v-for="option in question.options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <label v-if="question.description" class="label">
      <span class="label-text-alt text-base-content/60">{{ question.description }}</span>
    </label>
  </div>
</template>
```

### 6. Componente MultiSelectQuestion

```vue
<!-- components/BrandPositioning/Forms/MultiSelectQuestion.vue -->
<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text font-semibold">
        {{ question.text }}
        <span v-if="question.is_required" class="text-error">*</span>
      </span>
      <div
        v-if="question.description"
        class="tooltip tooltip-left"
        :data-tip="question.description"
      >
        <Icon name="heroicons:information-circle" class="w-4 h-4 text-base-content/60" />
      </div>
    </label>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <label
        v-for="option in question.options"
        :key="option"
        class="label cursor-pointer justify-start gap-3 p-3 rounded-lg border hover:bg-base-200 transition-colors"
        :class="{ 'border-primary bg-primary/10': selectedOptions.includes(option) }"
      >
        <input
          type="checkbox"
          :value="option"
          :checked="selectedOptions.includes(option)"
          @change="handleOptionChange(option)"
          class="checkbox checkbox-primary"
        />
        <span class="label-text">{{ option }}</span>
      </label>
    </div>

    <label v-if="question.description" class="label">
      <span class="label-text-alt text-base-content/60">{{ question.description }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  question: Question
  modelValue: string
}>()

const emit = defineEmits<{
  'update:model-value': [value: string]
}>()

const selectedOptions = computed(() => {
  if (!props.modelValue) return []
  try {
    return JSON.parse(props.modelValue)
  } catch {
    return []
  }
})

const handleOptionChange = (option: string) => {
  const current = selectedOptions.value
  const updated = current.includes(option)
    ? current.filter(o => o !== option)
    : [...current, option]

  emit('update:model-value', JSON.stringify(updated))
}
</script>
```

### 7. Middleware de Autorização

```typescript
// middleware/brand-positioning-auth.ts
export default defineNuxtRouteMiddleware(to => {
  const user = useSupabaseUser()

  if (!user.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  const userMetadata = user.value.user_metadata || {}
  const parentId = userMetadata.parent_id

  if (parentId !== null && parentId !== undefined) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only master users can access Brand Positioning features'
    })
  }
})
```

## 🗃️ Stores (Pinia)

```typescript
// stores/brandPositioning.ts
export const useBrandPositioningStore = defineStore('brandPositioning', () => {
  const {
    data: sessions,
    pending: loadingSessions,
    error: errorSessions,
    refresh: refreshSessions
  } = useFetch<BrandPositioningSession[]>('/api/brand-positioning/sessions')

  const {
    data: chapters,
    pending: loadingChapters,
    error: errorChapters
  } = useFetch<Chapter[]>('/api/brand-positioning/chapters')

  const currentSession = ref<BrandPositioningSession | null>(null)
  const currentChapter = ref<Chapter | null>(null)
  const currentMissions = ref<Mission[]>([])
  const currentQuestions = ref<Question[]>([])
  const answers = ref<Record<number, string>>({})

  const createSession = async (title: string): Promise<BrandPositioningSession> => {
    const { data } = await $fetch<{ data: BrandPositioningSession }>(
      '/api/brand-positioning/sessions',
      {
        method: 'POST',
        body: { title }
      }
    )
    await refreshSessions()
    return data
  }

  const saveAnswers = async (sessionId: string, questionAnswers: Record<number, string>) => {
    await $fetch(`/api/brand-positioning/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: { answers: questionAnswers }
    })
  }

  const updateProgress = async (sessionId: string, chapterId: number, missionId: number) => {
    await $fetch(`/api/brand-positioning/sessions/${sessionId}/progress`, {
      method: 'POST',
      body: { chapterId, missionId }
    })
  }

  return {
    // State
    sessions,
    chapters,
    currentSession,
    currentChapter,
    currentMissions,
    currentQuestions,
    answers,

    // Loading states
    loadingSessions,
    loadingChapters,

    // Error states
    errorSessions,
    errorChapters,

    // Actions
    createSession,
    saveAnswers,
    updateProgress,
    refreshSessions
  }
})
```

## 🔧 Composables

```typescript
// composables/useBrandPositioning.ts
export const useBrandPositioning = () => {
  const store = useBrandPositioningStore()
  const route = useRoute()

  const currentSessionId = computed(() => route.params.sessionId as string)

  const loadSession = async (sessionId: string) => {
    const { data } = await $fetch<{ data: BrandPositioningSession }>(
      `/api/brand-positioning/sessions/${sessionId}`
    )
    store.currentSession = data
  }

  const loadChapterMissions = async (chapterId: number) => {
    const { data } = await $fetch<{ data: Mission[] }>(
      `/api/brand-positioning/missions/${chapterId}`
    )
    store.currentMissions = data
  }

  const loadMissionQuestions = async (missionId: number) => {
    const { data } = await $fetch<{ data: Question[] }>(
      `/api/brand-positioning/questions/${missionId}`
    )
    store.currentQuestions = data
  }

  const calculateProgress = (session: BrandPositioningSession): number => {
    // Lógica para calcular progresso baseado nas respostas
    return 0 // placeholder
  }

  return {
    // Computed
    sessions: computed(() => store.sessions),
    chapters: computed(() => store.chapters),
    currentSession: computed(() => store.currentSession),
    currentSessionId,

    // Methods
    loadSession,
    loadChapterMissions,
    loadMissionQuestions,
    calculateProgress,

    // Actions
    createSession: store.createSession,
    saveAnswers: store.saveAnswers,
    updateProgress: store.updateProgress
  }
}
```

## 🛣️ Rotas e Páginas

```vue
<!-- pages/brand-positioning/index.vue -->
<template>
  <div class="container mx-auto p-8">
    <div class="hero bg-base-200 rounded-lg mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-4xl font-bold">🎮 Jornada do Posicionamento</h1>
          <p class="py-6">
            Descubra o posicionamento único da sua marca através de uma aventura gamificada!
          </p>
          <NuxtLink to="/brand-positioning/new" class="btn btn-primary btn-lg">
            Iniciar Nova Jornada
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Lista de sessões existentes -->
    <div v-if="sessions?.length" class="space-y-4">
      <h2 class="text-2xl font-bold">Suas Jornadas</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="session in sessions"
          :key="session.id"
          class="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          @click="navigateToSession(session.id)"
        >
          <div class="card-body">
            <h3 class="card-title">{{ session.title }}</h3>
            <progress class="progress progress-primary" :value="session.total_progress" max="100" />
            <p class="text-sm text-base-content/70">{{ session.total_progress }}% completo</p>
            <div class="card-actions justify-end">
              <div class="badge" :class="statusBadgeClass(session.status)">
                {{ statusLabel(session.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

```vue
<!-- pages/brand-positioning/[sessionId]/chapter/[chapterId]/mission/[missionId].vue -->
<template>
  <BrandPositioningLayoutGameContainer>
    <div class="p-8 max-w-4xl mx-auto">
      <!-- Header da missão -->
      <div class="mb-8">
        <div class="breadcrumbs text-sm">
          <ul>
            <li>{{ currentChapter?.title }}</li>
            <li>{{ currentMission?.title }}</li>
          </ul>
        </div>
        <h1 class="text-3xl font-bold mt-2">{{ currentMission?.title }}</h1>
        <p class="text-base-content/70 mt-2">{{ currentMission?.description }}</p>
      </div>

      <!-- Formulário das questões -->
      <BrandPositioningUIQuestionForm
        :questions="currentQuestions"
        :answers="answers"
        :is-last-mission="isLastMission"
        @submit="handleSubmit"
        @previous="handlePrevious"
      />
    </div>
  </BrandPositioningLayoutGameContainer>
</template>
```

## 🚀 Ordem de Implementação

### Fase 1: Fundação (Dias 1-2)

1. ✅ Criar migrations e executar no Supabase
2. ✅ Definir tipos TypeScript em `shared/types/brand-positioning.ts`
3. ✅ Criar service base em `server/services/brandPositioningService.ts`
4. ✅ Implementar APIs básicas (CRUD sessions)

### Fase 2: Core Logic (Dias 3-4)

1. ✅ Implementar store Pinia
2. ✅ Criar composables principais
3. ✅ Desenvolver componentes de UI base (ProgressSidebar, ChapterMap)
4. ✅ Implementar lógica de progresso e navegação

### Fase 3: Interface Gamificada (Dias 5-6)

1. ✅ Criar layout GameContainer
2. ✅ Implementar formulários de questões dinâmicos
3. ✅ Desenvolver sistema de recompensas visuais
4. ✅ Adicionar animações e feedback visual

### Fase 4: Páginas e Integração (Dias 7-8)

1. ✅ Criar todas as páginas/rotas
2. ✅ Implementar navegação entre missões/capítulos
3. ✅ Adicionar sistema de salvamento automático
4. ✅ Implementar dicas contextuais (tooltips)

### Fase 5: Polimento e Testes (Dias 9-10)

1. ✅ Testes de fluxo completo
2. ✅ Ajustes de UX/UI
3. ✅ Otimização de performance
4. ✅ Tratamento de edge cases

## 📊 Métricas e Analytics

### Eventos a Trackear

- `session_created`: Nova jornada iniciada
- `mission_started`: Usuário iniciou uma missão
- `mission_completed`: Missão finalizada
- `chapter_completed`: Capítulo finalizado
- `session_completed`: Jornada completa finalizada
- `question_answered`: Resposta salva (para identificar drop-offs)

### KPIs do Sistema

- Taxa de conclusão por capítulo
- Tempo médio por missão
- Taxa de abandono por ponto da jornada
- Perguntas com maior taxa de skip/abandono

## 🔒 Considerações de Segurança

### Autorização de Usuários Master

- ✅ **Apenas usuários master podem acessar**: `parent_id IS NULL` na tabela users
- ✅ **Middleware de verificação**: Validar se user.parent_id é null antes de permitir acesso
- ✅ **RLS customizado**: Policies no Supabase para filtrar por parent_id
- ✅ **Validação nas APIs**: Todas as rotas verificam se o usuário é master

### RLS (Row Level Security) - Supabase

```sql
-- Policy para sessions: apenas usuários master podem criar/ver
CREATE POLICY "Users can only access their own sessions and must be master"
ON brand_positioning_sessions
FOR ALL
USING (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'parent_id' IS NULL
  )
);

-- Policy similar para outras tabelas relacionadas
```

### Outras Considerações

- ✅ Autenticação obrigatória (middleware)
- ✅ Validação de dados no servidor
- ✅ Rate limiting nas APIs
- ✅ Sanitização de inputs do usuário

## 📱 Responsividade

- ✅ Mobile-first design
- ✅ Sidebar colapsável em mobile
- ✅ Formulários otimizados para touch
- ✅ Navegação adaptativa por device

---

**Próximos Passos**: Começar pela Fase 1, criando as migrations e a estrutura de dados base. Depois seguir linearmente pelas fases para garantir uma implementação sólida e incremental.

## 🚨 Atualizações Importantes

### ✅ Tipos de Pergunta Suportados

- **Text**: Campo de texto curto
- **Textarea**: Campo de texto longo
- **Select**: Seleção única com opções predefinidas
- **Multi-select**: Seleção múltipla com checkboxes

**Exemplos de perguntas com alternativas:**

- "Qual é o seu tipo de negócio?" → Select entre ["Produto físico", "Serviço digital", "SaaS", "Consultoria"]
- "Quais canais você já utiliza?" → Multi-select entre ["Instagram", "Facebook", "LinkedIn", "YouTube"]

### 🔒 Autorização Apenas para Usuários Master

- **Restrição crítica**: Apenas usuários com `parent_id IS NULL` podem acessar
- **Middleware obrigatório**: Todas as páginas `/brand-positioning/*` verificam autorização
- **RLS no Supabase**: Policies garantem que apenas masters vejam seus dados
- **Validação nas APIs**: Verificação dupla em todas as rotas do servidor

Essas duas funcionalidades são **essenciais** para o funcionamento correto do sistema.
