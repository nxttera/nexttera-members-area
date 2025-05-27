export const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'social_media', label: 'Redes Sociais' },
  { value: 'email_campaign', label: 'Campanha de Email' },
  { value: 'referral', label: 'Indicação' },
  { value: 'cold_outreach', label: 'Prospecção Ativa' },
  { value: 'event', label: 'Evento' },
  { value: 'other', label: 'Outros' }
] as const

export const LEAD_STATUSES = [
  { value: 'new', label: 'Novo', color: 'badge-info' },
  { value: 'qualified', label: 'Qualificado', color: 'badge-primary' },
  { value: 'contacted', label: 'Contatado', color: 'badge-warning' },
  { value: 'nurturing', label: 'Nutrição', color: 'badge-accent' },
  { value: 'converted', label: 'Convertido', color: 'badge-success' },
  { value: 'lost', label: 'Perdido', color: 'badge-error' }
] as const

export const DEAL_STAGES = [
  { value: 'prospecting', label: 'Prospecção', probability: 10, color: 'bg-slate-500' },
  { value: 'qualification', label: 'Qualificação', probability: 25, color: 'bg-blue-500' },
  { value: 'proposal', label: 'Proposta', probability: 60, color: 'bg-yellow-500' },
  { value: 'negotiation', label: 'Negociação', probability: 80, color: 'bg-orange-500' },
  { value: 'closed_won', label: 'Fechado Ganho', probability: 100, color: 'bg-green-500' },
  { value: 'closed_lost', label: 'Fechado Perdido', probability: 0, color: 'bg-red-500' }
] as const

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Ligação', icon: 'heroicons:phone' },
  { value: 'email', label: 'Email', icon: 'heroicons:envelope' },
  { value: 'meeting', label: 'Reunião', icon: 'heroicons:users' },
  { value: 'demo', label: 'Demonstração', icon: 'heroicons:presentation-chart-line' },
  { value: 'follow_up', label: 'Follow-up', icon: 'heroicons:arrow-path' },
  { value: 'proposal', label: 'Proposta', icon: 'heroicons:document-text' },
  { value: 'contract', label: 'Contrato', icon: 'heroicons:document-check' }
] as const

export const USER_ROLES = [
  { value: 'admin', label: 'Administrador', permissions: ['all'] },
  { value: 'manager', label: 'Gerente', permissions: ['read', 'write', 'manage_team'] },
  { value: 'analyst', label: 'Analista', permissions: ['read', 'write'] },
  { value: 'viewer', label: 'Visualizador', permissions: ['read'] }
] as const

export const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup (1-10)', color: 'badge-info' },
  { value: 'small', label: 'Pequena (11-50)', color: 'badge-primary' },
  { value: 'medium', label: 'Média (51-200)', color: 'badge-warning' },
  { value: 'large', label: 'Grande (201-1000)', color: 'badge-accent' },
  { value: 'enterprise', label: 'Enterprise (1000+)', color: 'badge-success' }
] as const

export const REPORT_TYPES = [
  { value: 'revenue', label: 'Receita', icon: 'heroicons:currency-dollar' },
  { value: 'conversion', label: 'Conversão', icon: 'heroicons:arrow-trending-up' },
  { value: 'pipeline', label: 'Pipeline', icon: 'heroicons:funnel' },
  { value: 'activity', label: 'Atividades', icon: 'heroicons:clock' },
  { value: 'performance', label: 'Performance', icon: 'heroicons:chart-bar' }
] as const

export const DATE_PRESETS = [
  { value: 'today', label: 'Hoje' },
  { value: 'yesterday', label: 'Ontem' },
  { value: 'last_7_days', label: 'Últimos 7 dias' },
  { value: 'last_30_days', label: 'Últimos 30 dias' },
  { value: 'this_month', label: 'Este mês' },
  { value: 'last_month', label: 'Mês passado' },
  { value: 'this_quarter', label: 'Este trimestre' },
  { value: 'last_quarter', label: 'Trimestre passado' },
  { value: 'this_year', label: 'Este ano' },
  { value: 'last_year', label: 'Ano passado' }
] as const

export const CURRENCIES = [
  { value: 'BRL', label: 'Real (R$)', symbol: 'R$' },
  { value: 'USD', label: 'Dólar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' }
] as const

export const FILTER_OPERATORS = [
  { value: 'equals', label: 'Igual a' },
  { value: 'not_equals', label: 'Diferente de' },
  { value: 'contains', label: 'Contém' },
  { value: 'greater_than', label: 'Maior que' },
  { value: 'less_than', label: 'Menor que' },
  { value: 'between', label: 'Entre' }
] as const

export const METRIC_AGGREGATIONS = [
  { value: 'sum', label: 'Soma' },
  { value: 'count', label: 'Contagem' },
  { value: 'average', label: 'Média' },
  { value: 'min', label: 'Mínimo' },
  { value: 'max', label: 'Máximo' }
] as const

export const PAGINATION_LIMITS = [10, 25, 50, 100] as const

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 25
} as const

export const API_ENDPOINTS = {
  LEADS: '/api/leads',
  DEALS: '/api/deals',
  ACTIVITIES: '/api/activities',
  REPORTS: '/api/reports',
  AUTOMATIONS: '/api/automations',
  USERS: '/api/users',
  COMPANIES: '/api/companies',
  PIPELINES: '/api/pipelines'
} as const

export const TOAST_DURATION = 4000 as const

export const DEBOUNCE_DELAY = 300 as const
