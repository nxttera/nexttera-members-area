export const useAiTools = () => {
  const tools = ref<AiAgentTool[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchTools = async () => {
    if (tools.value.length > 0) return;

    try {
      isLoading.value = true;
      error.value = null;

      const response = await $fetch<{ data: AiAgentTool[] }>("/api/ai-tools");
      tools.value = response.data;
    } catch (err) {
      error.value = "Falha ao carregar ferramentas";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const getToolById = (id: string) => {
    return computed(() => tools.value.find((tool) => tool.id === id));
  };

  const getToolStats = async (toolId: string) => {
    try {
      const response = await $fetch<{ data: any }>(
        `/api/ai-tools/${toolId}/stats`,
      );
      return response.data;
    } catch (err) {
      console.error(
        `Falha ao carregar estatísticas da ferramenta ${toolId}:`,
        err,
      );
      return null;
    }
  };

  return {
    tools: readonly(tools),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchTools,
    getToolById,
    getToolStats,
  };
};
