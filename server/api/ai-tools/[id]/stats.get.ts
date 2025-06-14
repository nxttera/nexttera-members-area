import type { ToolUsageStats } from "~/shared/types/chat.types";

const MOCK_STATS: Record<string, ToolUsageStats> = {
  "copywriter": {
    totalSessions: 1247,
    totalMessages: 8934,
    averageSessionDuration: 12.5,
    mostUsedFeatures: [
      "Emails de vendas",
      "Headlines persuasivas",
      "Anúncios para redes sociais",
    ],
  },
  "customer_support": {
    totalSessions: 892,
    totalMessages: 5621,
    averageSessionDuration: 8.2,
    mostUsedFeatures: [
      "FAQ automático",
      "Triagem de tickets",
      "Suporte técnico básico",
    ],
  },
  "sales": {
    totalSessions: 634,
    totalMessages: 4127,
    averageSessionDuration: 15.8,
    mostUsedFeatures: [
      "Qualificação de leads",
      "Scripts de vendas",
      "Técnicas de fechamento",
    ],
  },
  "development": {
    totalSessions: 0,
    totalMessages: 0,
    averageSessionDuration: 0,
    mostUsedFeatures: [],
  },
};

export default defineEventHandler(async (event) => {
  const toolId = getRouterParam(event, "id");

  if (!toolId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID da ferramenta é obrigatório",
    });
  }

  const stats = MOCK_STATS[toolId];

  if (!stats) {
    throw createError({
      statusCode: 404,
      statusMessage: "Estatísticas não encontradas para esta ferramenta",
    });
  }

  return {
    data: stats,
  };
});
