export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  // Busca o perfil do usuário
  try {
    const userProfile = await $fetch("/api/user/profile");

    // Se o onboarding não foi completado, redireciona para onboarding
    if (!userProfile.onboarding_completed) {
      return navigateTo("/onboarding");
    }
  } catch (error) {
    // Se não conseguiu buscar o perfil, redireciona para onboarding
    console.error("Erro ao verificar perfil do usuário:", error);
    return navigateTo("/onboarding");
  }
});
