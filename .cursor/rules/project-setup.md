# Project Setup & Configuration Rules

## Initial Project Setup

### Project Creation

```bash
# Create new Nuxt project
npx nuxi@latest init nexttera-members-area
cd nexttera-members-area

# Install dependencies with Yarn
yarn install

# Add essential modules
yarn add --dev tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
```

### Required Directory Structure

```
nexttera-members-area/
├── .cursor/
│   └── rules/                  # Cursor Rules for AI assistance
├── .nuxt/                      # Generated Nuxt files
├── .output/                    # Build output
├── assets/
│   ├── css/
│   │   └── app.css            # Main CSS with Tailwind + daisyUI
│   └── images/                # Static images for assets
├── components/                 # Auto-imported Vue components
│   ├── charts/                # Data visualization components
│   ├── features/              # Feature-specific components
│   ├── forms/                 # Form input components
│   ├── layout/                # Header, Footer, Sidebar components
│   ├── tables/                # DataTable, PaginatedTable
│   └── ui/                    # BaseModal, BaseInput, BaseButton
├── composables/               # Auto-imported composables
├── layouts/
│   └── default.vue           # Main application layout
├── middleware/                # Route middleware
├── pages/                     # File-based routing
├── plugins/                   # Nuxt plugins
├── public/                    # Static assets
│   ├── images/               # Public images (avatars, logos)
│   └── icons/                # Public icons
├── server/
│   ├── api/                  # API routes for RevOps data
│   └── middleware/           # Server middleware
├── shared/                    # Shared utilities and types
│   ├── constants/            # Application constants
│   │   └── index.ts         # RevOps constants (statuses, stages, etc.)
│   ├── scripts/             # Build and deployment scripts
│   ├── types/               # Shared TypeScript types
│   │   └── index.ts        # RevOps data types (Lead, Deal, etc.)
│   └── utils/               # Shared utility functions
│       └── index.ts        # Formatters, validators, helpers
├── stores/                   # Pinia stores (if needed)
├── types/                    # Global TypeScript types
├── utils/                    # General utilities
├── app.vue                   # Root component
├── error.vue                 # Custom error page
├── nuxt.config.ts           # Nuxt configuration
└── package.json
```

## Configuration Files

### Primary Nuxt Configuration (nuxt.config.ts)

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/scripts', '@nuxt/test-utils'],

  vite: {
    plugins: [tailwindcss()]
  },

  css: ['~/assets/app.css'],

  app: {
    head: {
      title: 'Nexttera RevOps',
      htmlAttrs: {
        lang: 'pt-BR'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Plataforma de Revenue Operations da Nexttera'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '/api'
    }
  }
})
```

### Main CSS File (assets/app.css)

```css
@import 'tailwindcss';
@plugin "daisyui";
```

### Package.json Configuration

```json
{
  "name": "nexttera-members-area",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "nuxt typecheck"
  },
  "devDependencies": {
    "@nuxt/devtools": "latest",
    "@tailwindcss/vite": "^4.1.7",
    "daisyui": "^5.0.38",
    "nuxt": "^3.17.0",
    "tailwindcss": "latest",
    "vue": "^3.4.0",
    "vue-router": "^4.4.0"
  },
  "dependencies": {
    "@nuxt/icon": "^1.13.0",
    "@nuxt/image": "^1.10.0",
    "@nuxt/scripts": "^0.11.7",
    "@nuxt/test-utils": "^3.19.1"
  }
}
```

## RevOps-Specific Structure

### Shared Types (shared/types/index.ts)

Contains TypeScript interfaces for:

- `User` - User management and roles
- `Company` - Company information and settings
- `Lead` - Lead tracking and management
- `Deal` - Sales pipeline and deals
- `Activity` - Sales activities and follow-ups
- `Pipeline` - Custom sales pipelines
- `Report` - Analytics and reporting
- `Automation` - Workflow automations
- `ApiResponse` - API response standards

### Constants (shared/constants/index.ts)

Defines application constants:

- Lead sources and statuses
- Deal stages and probabilities
- Activity types and statuses
- User roles and permissions
- Report types and filters
- Date presets and currencies
- API endpoints

### Utilities (shared/utils/index.ts)

Provides utility functions:

- Currency and number formatting
- Date and time handling
- Text manipulation and validation
- Performance optimization (debounce, throttle)
- RevOps calculations (growth rate, percentages)
- Data validation (email, phone)

## Core Application Files

### Root Application (app.vue)

```vue
<template>
  <div class="min-h-screen bg-base-100">
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold text-base-content">Nexttera RevOps</h1>
          <p class="py-6 text-base-content/70">
            Plataforma completa de Revenue Operations para otimizar seus processos de vendas e
            crescimento
          </p>
          <div class="flex gap-4 justify-center">
            <button class="btn btn-primary">Entrar</button>
            <button class="btn btn-outline">Saber Mais</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### Default Layout (layouts/default.vue)

Includes navigation for:

- Dashboard (metrics overview)
- Pipeline (sales funnel management)
- Análises (analytics and reports)
- Automações (workflow automation)
- Relatórios (detailed reporting)

### Error Page (error.vue)

Custom error handling with:

- Contextual error messages
- Recovery actions
- User-friendly design
- Navigation options

## Navigation Structure

### Main Navigation Items

```typescript
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'heroicons:home' },
  { name: 'Pipeline', href: '/pipeline', icon: 'heroicons:funnel' },
  { name: 'Análises', href: '/analytics', icon: 'heroicons:chart-bar' },
  { name: 'Automações', href: '/automations', icon: 'heroicons:cog-6-tooth' },
  { name: 'Relatórios', href: '/reports', icon: 'heroicons:document-chart-bar' }
]
```

## Development Workflow

### Environment Variables (.env)

```env
# API Configuration
NUXT_API_SECRET=your-secret-key
NUXT_PUBLIC_API_BASE=https://api.nexttera.com

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/nexttera_revops

# External Services
CRM_API_KEY=your-crm-api-key
EMAIL_API_KEY=your-email-api-key
ANALYTICS_API_KEY=your-analytics-api-key
```

### Git Configuration (.gitignore)

```gitignore
# Nuxt dev/build outputs
.output
.nuxt
.nitro
.cache
dist

# Node dependencies
node_modules

# Logs
*.log*

# Environment files
.env
.env.*
!.env.example

# Misc
.DS_Store
.fleet
.idea
```

## Deployment Configuration

### Build Settings

- Use `yarn build` for production builds
- Configure environment variables for different stages (dev, staging, prod)
- Set up proper caching strategies for RevOps data
- Implement health checks and monitoring for sales metrics

### Performance Optimization

- Enable image optimization with `<NuxtImg>` for dashboards
- Configure proper prerendering for static reports
- Implement code splitting for heavy analytics components
- Set up CDN for static assets and charts

## RevOps Features Structure

### Dashboard Components

- Revenue metrics cards
- Sales pipeline visualization
- Activity timeline
- Performance indicators

### Pipeline Management

- Drag-and-drop deal stages
- Lead scoring visualization
- Conversion rate tracking
- Sales forecasting

### Analytics & Reporting

- Revenue growth charts
- Conversion funnel analysis
- Sales performance metrics
- Custom report builder

### Automation Features

- Lead nurturing workflows
- Sales process automation
- Email campaign triggers
- Task assignment rules
