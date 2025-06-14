<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const LOGIN_PAGE_TITLE = 'Login'

definePageMeta({
  layout: false,
  title: LOGIN_PAGE_TITLE
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
    <div class="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div class="card w-1/2 max-w-2xl p-4 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            {{ t('pages.login.card.title') }}
          </h2>
          <p>
            {{ t('pages.login.card.description') }}
            <NuxtLink to="/register">
              {{ t('pages.login.card.signUp') }}
            </NuxtLink>
          </p>
          <AuthLoginForm />
          <NuxtLink class="ml-auto" to="/forgot-password">
            {{ t('pages.login.card.forgotPassword') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
pt:
  pages:
    login:
      title: Login
      card:
        title: 'Acesso'
        description: 'Não tem cadastro?'
        signUp: 'Cadastre-se'
        forgotPassword: 'Esqueceu sua senha?'
        or: 'OU'
en:
  pages:
    login:
      title: Login
      card:
        title: 'Access'
        description: "Don't have an account?"
        signUp: 'Sign up'
        forgotPassword: 'Forgot your password?'
        or: 'OR'
es:
  pages:
    login:
      title: Login
      card:
        title: 'Acceso'
        description: 'No tienes una cuenta?'
        signUp: 'Registrate'
        forgotPassword: 'Olvidaste tu contraseña?'
        or: 'O'
</i18n>
