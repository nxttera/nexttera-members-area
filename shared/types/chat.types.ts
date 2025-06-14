export interface AiAgentTool {
  id: string;
  name: string;
  description: string;
  category: "copywriting" | "support" | "sales" | "analysis" | "general";
  webhookUrl: string;
  isAvailable: boolean;
  features: string[];
  config: AiAgentConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AiAgentConfig {
  initialMessages: string[];
  placeholder: string;
  title: string;
  subtitle: string;
  customization: {
    primaryColor: string;
    mode: "window" | "fullscreen";
    position?: "bottom-right" | "bottom-left";
  };
}

export interface ChatSession {
  id: string;
  user_id: string;
  tool_id: string;
  title: string;
  is_active: boolean;
  last_message_at: string;
  created_at: string;
  updated_at?: string | null;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  session_id: string;
  type: "user" | "bot" | "system";
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  metadata?: Record<string, unknown>;
}

export type AiToolCategory = AiAgentTool["category"];

export interface ToolUsageStats {
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  mostUsedFeatures: string[];
}
