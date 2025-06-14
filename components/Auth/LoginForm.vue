<script setup lang="ts">
const { t } = useI18n({ useScope: 'local' })

const DEFAULT_ROUTE = '/'
const FORM_FIELD_EMAIL = 'email'
const FORM_FIELD_PASSWORD = 'password'

const extractFormCredentials = (payload: FormData): LoginEmailAndPasswordCredentials | null => {
  const email = payload.get(FORM_FIELD_EMAIL)?.toString().trim()
  const password = payload.get(FORM_FIELD_PASSWORD)?.toString().trim()

  if (!email || !password) {
    return null
  }

  return {
    email,
    password
  }
}

const handleAuthError = (error: any): void => {
  loggerInfo('error', error)
  // useInAppNotification().error(t(error.message))
}

const signInWithCreds = async (_: Event, payload: FormData): Promise<void> => {
  const credentials = extractFormCredentials(payload)

  if (!credentials) {
    return
  }

  const response = await useAuth().signInWithCredentials(credentials)
  if (response?.error) {
    handleAuthError(response.error)
    return
  }

  await navigateTo(DEFAULT_ROUTE)
}
</script>

<template>
  <FormBase @submit="signInWithCreds">
    <FormInput
      :name="FORM_FIELD_EMAIL"
      input-type="email"
      :rules="['required', 'email']"
      :label="t('components.form.login.email')"
      :placeholder="t('components.form.login.email')"
      :field-name="t('components.form.login.email')"
      :floating="false"
    />
    <FormInput
      :name="FORM_FIELD_PASSWORD"
      input-type="password"
      :rules="['required']"
      :label="t('components.form.login.password')"
      :placeholder="t('components.form.login.password')"
      :field-name="t('components.form.login.password')"
      :floating="false"
    />
    <FormButton
      name="submit"
      button-class="btn btn-primary"
      :button-label="t('components.form.login.submit')"
      :submits="true"
      :full="true"
    />
  </FormBase>
</template>

<i18n lang="yaml">
pt:
  components:
    form:
      login:
        submit: 'Entrar'
        email: 'E-mail'
        password: 'Senha'
  'Invalid login credentials': 'E-mail ou senha inválidos.'
en:
  components:
    form:
      login:
        submit: 'Login'
        email: 'Email'
        password: 'Password'
  'Invalid login credentials': 'Invalid login credentials.'
es:
  components:
    form:
      login:
        submit: 'Iniciar sesión'
        email: 'Correo electrónico'
        password: 'Contraseña'
  'Invalid login credentials': 'Credenciales de inicio de sesión inválidas.'
</i18n>
