export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }

  try {
    const userProfile = await $fetch("/api/user/profile");

    if (!userProfile.onboarding_completed) {
      return navigateTo("/onboarding");
    }
  } catch (error) {
    console.error("Erro ao verificar perfil do usuário:", error);
    return navigateTo("/onboarding");
  }
});
