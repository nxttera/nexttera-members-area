import type { AiAgentTool } from "~/shared/types/chat.types";

const AVAILABLE_AI_TOOLS: AiAgentTool[] = [
  {
    id: "copywriter",
    name: "Copywriting Pro",
    description:
      "Ferramenta avançada para criação de textos persuasivos, anúncios e conteúdo de marketing de alta conversão",
    category: "copywriting",
    webhookUrl:
      "https://webhook.nexttera.com.br/webhook/246d5b8d-fc5e-4099-9f3e-ab34793147c6/chat",
    isAvailable: true,
    features: [
      "Emails de vendas",
      "Anúncios para redes sociais",
      "Landing pages",
      "Scripts de vídeo",
      "Headlines persuasivas",
    ],
    config: {
      initialMessages: [
        "Olá! 👋",
        "Sou seu especialista em copywriting. Vamos criar textos que convertem?",
      ],
      placeholder: "Descreva o que você precisa criar...",
      title: "Copywriting Pro",
      subtitle: "Textos que vendem e convertem",
      customization: {
        primaryColor: "#8b5cf6",
        mode: "fullscreen",
        position: "bottom-right",
      },
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: "customer_support",
    name: "Assistente de Suporte",
    description:
      "Ferramenta inteligente para atendimento ao cliente e resolução de dúvidas técnicas",
    category: "support",
    webhookUrl: "https://n8n-demo.ngrok.io/webhook/support",
    isAvailable: false,
    features: [
      "FAQ automático",
      "Triagem de tickets",
      "Suporte técnico básico",
      "Escalamento inteligente",
    ],
    config: {
      initialMessages: [
        "Olá! Como posso ajudar você hoje?",
        "Estou aqui para resolver suas dúvidas rapidamente.",
      ],
      placeholder: "Descreva seu problema ou dúvida...",
      title: "Assistente de Suporte",
      subtitle: "Suporte inteligente 24/7",
      customization: {
        primaryColor: "#8b5cf6",
        mode: "window",
        position: "bottom-right",
      },
    },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z",
  },
  {
    id: "sales",
    name: "Consultor de Vendas IA",
    description: "Especialista em qualificação de leads e fechamento de vendas",
    category: "sales",
    webhookUrl: "https://n8n-demo.ngrok.io/webhook/sales",
    features: [
      "Qualificação de leads",
      "Técnicas de fechamento",
      "Objeções mais comuns",
      "Scripts de vendas",
      "Follow-up automático",
    ],
    isAvailable: false,
    config: {
      initialMessages: [
        "Oi! Vamos turbinar suas vendas?",
        "Posso ajudar você a qualificar leads e fechar mais negócios.",
      ],
      placeholder: "Conte sobre seu prospect ou processo de vendas...",
      title: "Consultor de Vendas IA",
      subtitle: "Maximize suas conversões",
      customization: {
        primaryColor: "#f59e0b",
        mode: "fullscreen",
        position: "bottom-right",
      },
    },
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-15T09:45:00Z",
  },
  {
    id: "development",
    name: "Analista de Dados IA",
    description:
      "Ferramenta para análise de dados, métricas e insights de negócio",
    category: "analysis",
    webhookUrl: "https://n8n-demo.ngrok.io/webhook/analysis",
    isAvailable: false,
    features: [
      "Análise de métricas",
      "Relatórios automáticos",
      "Identificação de padrões",
      "Previsões e tendências",
    ],
    config: {
      initialMessages: [
        "Olá! Vamos analisar seus dados?",
        "Posso ajudar você a extrair insights valiosos dos seus dados.",
      ],
      placeholder: "Descreva os dados que você quer analisar...",
      title: "Analista de Dados IA",
      subtitle: "Insights baseados em dados",
      customization: {
        primaryColor: "#3b82f6",
        mode: "window",
        position: "bottom-right",
      },
    },
    createdAt: "2024-01-08T16:00:00Z",
    updatedAt: "2024-01-22T11:15:00Z",
  },
];

export default defineEventHandler(async () => {
  const availableTools = AVAILABLE_AI_TOOLS.filter((tool) => tool.isAvailable);

  return {
    data: AVAILABLE_AI_TOOLS,
    total: AVAILABLE_AI_TOOLS.length,
    available: availableTools.length,
    categories: [...new Set(AVAILABLE_AI_TOOLS.map((tool) => tool.category))],
  };
});
