import type {
  AiAgentConfig,
  AiAgentTool,
  AiToolCategory,
  ToolUsageStats,
} from "~/shared/types/chat.types";

const DEFAULT_TOOL_CONFIGS: Record<AiToolCategory, Partial<AiAgentConfig>> = {
  copywriting: {
    initialMessages: [
      "Olá! 👋",
      "Sou seu assistente de copywriting. Como posso ajudar você hoje?",
    ],
    placeholder: "Digite sua solicitação de copy...",
    title: "Assistente de Copywriting",
    subtitle: "Criação de textos persuasivos e envolventes",
    customization: {
      primaryColor: "#8b5cf6",
      mode: "window",
      position: "bottom-right",
    },
  },
  support: {
    initialMessages: ["Olá! Como posso ajudar você?"],
    title: "Suporte",
    subtitle: "Estamos aqui para ajudar",
    placeholder: "Descreva seu problema...",
    customization: {
      primaryColor: "#10b981",
      mode: "window",
    },
  },
  sales: {
    initialMessages: ["Oi! Vamos conversar sobre suas necessidades?"],
    title: "Consultor de Vendas",
    subtitle: "Encontre a solução perfeita",
    placeholder: "Como posso ajudar com sua compra?",
    customization: {
      primaryColor: "#f59e0b",
      mode: "window",
    },
  },
  analysis: {
    initialMessages: ["Olá! Pronto para analisar seus dados?"],
    title: "Analista IA",
    subtitle: "Insights baseados em dados",
    placeholder: "Que análise você precisa?",
    customization: {
      primaryColor: "#3b82f6",
      mode: "window",
    },
  },
  general: {
    initialMessages: ["Olá! Como posso ajudar?"],
    title: "Assistente Geral",
    subtitle: "Assistência geral",
    placeholder: "Digite sua pergunta...",
    customization: {
      primaryColor: "#6b7280",
      mode: "window",
    },
  },
};

export const useAiAgents = () => {
  const tools = ref<AiAgentTool[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchTools = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch<{ data: AiAgentTool[] }>("/api/ai-tools");
      tools.value = data;
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : "Erro ao carregar ferramentas de IA";
    } finally {
      isLoading.value = false;
    }
  };

  const getToolsByCategory = (category: AiToolCategory) => {
    return computed(() =>
      tools.value.filter((tool) => tool.category === category)
    );
  };

  const getAvailableTools = computed(() =>
    tools.value.filter((tool) => tool.isAvailable)
  );

  const getFeaturedTools = computed(() =>
    tools.value.filter((tool) => tool.isAvailable && tool.features.length > 0)
  );

  const searchTools = (query: string) => {
    return computed(() => {
      if (!query) return tools.value;

      const searchTerm = query.toLowerCase();
      return tools.value.filter((tool) =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.features.some((feature) =>
          feature.toLowerCase().includes(searchTerm)
        )
      );
    });
  };

  const getToolUsageStats = async (toolId: string): Promise<ToolUsageStats> => {
    try {
      const { data } = await $fetch<{ data: ToolUsageStats }>(
        `/api/ai-tools/${toolId}/stats`,
      );
      return data;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Erro ao buscar estatísticas",
      );
    }
  };

  return {
    tools: tools,
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchTools,
    getToolsByCategory,
    getAvailableTools,
    getFeaturedTools,
    searchTools,
    getToolUsageStats,
    defaultConfigs: DEFAULT_TOOL_CONFIGS,
  };
};
