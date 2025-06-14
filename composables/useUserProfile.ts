interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  is_active: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const user = useSupabaseUser();

  const userProfile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user.value) return null;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch("/api/user/profile");
      userProfile.value = data as UserProfile;
      return data;
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Erro ao carregar perfil";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserProfile = async (
    updates: Partial<Pick<UserProfile, "name" | "phone" | "company">>,
  ) => {
    if (!user.value) return null;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await $fetch("/api/user/profile", {
        method: "PUT",
        body: updates,
      });

      userProfile.value = data as UserProfile;
      return data;
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Erro ao atualizar perfil";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  watch(user, () => {
    if (user.value) {
      fetchUserProfile();
    } else {
      userProfile.value = null;
    }
  }, { immediate: true });

  return {
    userProfile: readonly(userProfile),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchUserProfile,
    updateUserProfile,
  };
};
