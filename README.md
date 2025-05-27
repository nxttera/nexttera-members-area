# Nexttera RevOps Platform

Plataforma completa de Revenue Operations para otimizar processos de vendas e crescimento, construída com Nuxt 3, Tailwind CSS e daisyUI.

## Stack Tecnológico

- **Framework**: Nuxt 3
- **Styling**: Tailwind CSS + daisyUI
- **Linguagem**: TypeScript
- **Gerenciador de Pacotes**: Yarn

## Configuração

Instale as dependências:

```bash
yarn install
```

## Servidor de Desenvolvimento

Inicie o servidor de desenvolvimento em `http://localhost:3000`:

```bash
yarn dev
```

## Produção

Construa a aplicação para produção:

```bash
yarn build
```

Visualize a build de produção localmente:

```bash
yarn preview
```

## Estrutura do Projeto

```
nexttera-members-area/
├── assets/          # CSS e recursos estáticos
├── components/      # Componentes Vue reutilizáveis
│   ├── charts/      # Componentes de visualização de dados
│   ├── features/    # Componentes específicos por funcionalidade
│   ├── forms/       # Componentes de formulário
│   ├── layout/      # Header, Footer, Sidebar
│   ├── tables/      # Tabelas e grids de dados
│   └── ui/          # Componentes base (modais, inputs, botões)
├── composables/     # Composables auto-importados
├── layouts/         # Layouts da aplicação
├── middleware/      # Middleware de rotas
├── pages/           # Páginas da aplicação (roteamento automático)
├── server/          # API routes e middleware do servidor
├── shared/          # Utilitários e tipos compartilhados
│   ├── constants/   # Constantes da aplicação
│   ├── scripts/     # Scripts de build e deploy
│   ├── types/       # Types TypeScript compartilhados
│   └── utils/       # Funções utilitárias
├── public/          # Arquivos estáticos públicos
└── nuxt.config.ts   # Configuração do Nuxt
```

## Funcionalidades RevOps

### Dashboard de Métricas

- Visão geral de receita e performance
- KPIs de vendas em tempo real
- Gráficos de conversão e pipeline
- Análise de tendências

### Gestão de Pipeline

- Visualização do funil de vendas
- Gestão de leads e oportunidades
- Tracking de atividades e follow-ups
- Automação de processos

### Análises e Relatórios

- Relatórios de receita e crescimento
- Análise de performance por vendedor
- Métricas de conversão
- Previsões de vendas

### Automações

- Workflows de nurturing
- Distribuição automática de leads
- Notificações e lembretes
- Integração com ferramentas externas

## Tecnologias Integradas

- **@nuxt/icon**: Sistema de ícones com +200k ícones
- **@nuxt/image**: Otimização automática de imagens
- **@nuxt/scripts**: Carregamento otimizado de scripts
- **@nuxt/test-utils**: Utilitários para testes
- **daisyUI**: Componentes prontos para Tailwind CSS
