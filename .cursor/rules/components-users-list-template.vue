<script setup lang="ts">
const { t } = useI18n({
  useScope: 'local'
})

const { users, isLoading: usersLoading, fetchUsers } = useUsers()
const { products, isLoading: productsLoading, fetchProducts } = useProducts()

const isUILoading = computed(() => usersLoading.value || productsLoading.value)

onMounted(async () => {
  await Promise.all([fetchUsers(), fetchProducts()])
})
</script>

<template>
  <div>
    <div v-if="isUILoading">
      {{ t('loading') }}
    </div>
    <div v-else>
      <h2>{{ t('users') }}</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
        </li>
      </ul>

      <h2>{{ t('products') }}</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<i18n>
  pt:
    users: Usuários
    products: Produtos
    loading: Carregando...
  en:
    users: Users
    products: Products
    loading: Loading...
</i18n>
