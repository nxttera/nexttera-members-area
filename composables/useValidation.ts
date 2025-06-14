export const useValidation = () => {
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const validatePasswordStrength = (password: string): boolean => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password)
    )
  }

  const getPasswordStrengthMessage = (password: string): string => {
    if (password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres'
    }

    if (password.length < 8) {
      return 'Recomendado: 8+ caracteres'
    }

    if (!validatePasswordStrength(password)) {
      return 'Recomendado: inclua maiúscula, minúscula e número'
    }

    return 'Senha forte'
  }

  const getEmailValidationMessage = (email: string): string => {
    if (!email) {
      return 'Email é obrigatório'
    }

    if (!validateEmail(email)) {
      return 'Email deve ter formato válido'
    }

    return ''
  }

  return {
    validateEmail,
    validatePassword,
    validatePasswordStrength,
    getPasswordStrengthMessage,
    getEmailValidationMessage
  }
}
