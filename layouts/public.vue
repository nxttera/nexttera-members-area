<script setup lang="ts">
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'heroicons:home' },
  { name: 'Pipeline', href: '/pipeline', icon: 'heroicons:funnel' },
  { name: 'Análises', href: '/analytics', icon: 'heroicons:chart-bar' },
  { name: 'Formulários', href: '/formularios', icon: 'heroicons:document-text' },
  { name: 'Chats', href: '/chats', icon: 'heroicons:chat-bubble-left' },
  { name: 'Automações', href: '/automations', icon: 'heroicons:cog-6-tooth' },
  { name: 'Relatórios', href: '/reports', icon: 'heroicons:document-chart-bar' }
]

const userMenuItems = [
  { name: 'Perfil', href: '/profile' },
  { name: 'Configurações', href: '/settings' },
  { name: 'Sair', href: '/logout' }
]
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <header class="navbar bg-base-200 shadow-sm">
      <div class="navbar-start">
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <Icon name="heroicons:bars-3" class="h-5 w-5" />
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="item in navigation" :key="item.name">
              <NuxtLink :to="item.href" class="flex items-center gap-2">
                <Icon :name="item.icon" class="h-4 w-4" />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink to="/" class="btn btn-ghost text-xl font-bold text-primary"> Nexttera </NuxtLink>
      </div>

      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li v-for="item in navigation" :key="item.name">
            <NuxtLink :to="item.href" class="btn btn-ghost flex items-center gap-2">
              <Icon :name="item.icon" class="h-4 w-4" />
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="navbar-end gap-2">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <Icon name="heroicons:bell" class="h-5 w-5" />
          </label>
          <div
            tabindex="0"
            class="dropdown-content z-[1] card card-compact w-80 p-2 shadow bg-base-100"
          >
            <div class="card-body">
              <span class="font-bold text-lg">Notificações</span>
              <p class="text-base-content/70">Nenhuma notificação nova</p>
            </div>
          </div>
        </div>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="/images/avatar-placeholder.svg" alt="Avatar" />
            </div>
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li v-for="item in userMenuItems" :key="item.name">
              <NuxtLink :to="item.href">{{ item.name }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="footer footer-center p-10 bg-base-200 text-base-content mt-16">
      <aside>
        <Icon name="heroicons:heart" class="h-6 w-6 text-primary" />
        <p class="font-semibold">Nexttera Members Area</p>
        <p>© 2025 Nexttera. Todos os direitos reservados.</p>
      </aside>
    </footer>
  </div>
</template>
