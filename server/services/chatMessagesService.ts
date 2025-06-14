import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage } from "~/shared/types/chat.types";
import { loggerError, loggerInfo } from "~/shared/utils/logger";

export class ChatMessagesService {
  constructor(private supabase: SupabaseClient) {}

  async getMessagesBySession(
    sessionId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    loggerInfo("Iniciando getMessagesBySession", {
      sessionId,
      userId,
      page,
      limit,
    });

    const startIndex = (page - 1) * limit;

    const { data: session, error: sessionError } = await this.supabase
      .from("chat_sessions")
      .select("id, user_id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    loggerInfo("Resultado da busca da sessão", {
      session,
      sessionError,
      sessionId,
      userId,
    });

    if (sessionError || !session) {
      loggerError("Sessão não encontrada", {
        sessionError,
        sessionId,
        userId,
      });
      throw new Error("Sessão não encontrada ou não autorizada");
    }

    let query = this.supabase
      .from("chat_messages")
      .select("*", { count: "exact" })
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false });

    if (page > 1) {
      query = query.range(startIndex, startIndex + limit - 1);
    } else {
      query = query.limit(limit);
    }

    const { data: messages, error: messagesError, count } = await query;

    if (messagesError) {
      if (messagesError.message?.includes("range not satisfiable")) {
        return {
          messages: [],
          hasMore: false,
          totalMessages: 0,
          currentPage: page,
          totalPages: 0,
        };
      }
      throw new Error(`Erro ao buscar mensagens: ${messagesError.message}`);
    }

    const hasMore = count ? startIndex + limit < count : false;

    return {
      messages: (messages || []).reverse(),
      hasMore,
      totalMessages: count || 0,
      currentPage: page,
      totalPages: count ? Math.ceil(count / limit) : 0,
    };
  }

  async createUserMessage(sessionId: string, userId: string, content: string) {
    loggerInfo("Criando mensagem do usuário", {
      sessionId,
      userId,
      contentLength: content.length,
    });

    const { data: session, error: sessionError } = await this.supabase
      .from("chat_sessions")
      .select("id, user_id, tool_id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    loggerInfo("Sessão encontrada", { session, sessionError });

    if (sessionError || !session) {
      loggerError("Erro ao encontrar sessão", sessionError);
      throw new Error("Sessão não encontrada ou não autorizada");
    }

    const userMessage = {
      session_id: sessionId,
      type: "user" as const,
      content,
      metadata: null,
    };

    loggerInfo("Inserindo mensagem do usuário", userMessage);

    const { data: createdMessage, error: messageError } = await this.supabase
      .from("chat_messages")
      .insert(userMessage)
      .select()
      .single();

    loggerInfo("Resultado da inserção da mensagem do usuário", {
      createdMessage,
      messageError,
    });

    if (messageError) {
      loggerError("Erro ao inserir mensagem do usuário", messageError);
      throw new Error(
        `Erro ao criar mensagem do usuário: ${messageError.message}`,
      );
    }

    await this.updateSessionLastMessage(sessionId);

    return createdMessage;
  }

  async createBotMessage(
    sessionId: string,
    content: string,
    metadata?: Record<string, unknown>,
  ) {
    loggerInfo("Criando mensagem do bot", {
      sessionId,
      contentLength: content.length,
    });

    const botMessage = {
      session_id: sessionId,
      type: "bot" as const,
      content,
      metadata: metadata || null,
    };

    loggerInfo("Inserindo mensagem do bot", botMessage);

    const { data: createdMessage, error: messageError } = await this.supabase
      .from("chat_messages")
      .insert(botMessage)
      .select()
      .single();

    loggerInfo("Resultado da inserção da mensagem do bot", {
      createdMessage,
      messageError,
    });

    if (messageError) {
      loggerError("Erro ao inserir mensagem do bot", messageError);
      throw new Error(`Erro ao criar mensagem do bot: ${messageError.message}`);
    }

    await this.updateSessionLastMessage(sessionId);

    return createdMessage;
  }

  private async updateSessionLastMessage(sessionId: string) {
    const { error } = await this.supabase
      .from("chat_sessions")
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) {
      loggerError("Erro ao atualizar last_message_at da sessão", {
        sessionId,
        error,
      });
    }
  }

  async simulateBotResponse(userContent: string): Promise<string> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const responses = [
      `Entendi que você disse: "${userContent}". Como posso ajudar com isso?`,
      `Interessante! Sobre "${userContent}", posso sugerir algumas opções...`,
      `Vou analisar sua solicitação sobre "${userContent}" e te dar uma resposta detalhada.`,
      `Baseado no que você mencionou ("${userContent}"), aqui está minha sugestão...`,
      `Ótima pergunta! Sobre "${userContent}", posso explicar que...`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async validateSessionExists(sessionId: string, userId: string) {
    loggerInfo("Validando se sessão existe", { sessionId, userId });

    const { data: session, error: sessionError } = await this.supabase
      .from("chat_sessions")
      .select("id, user_id, tool_id, title, created_at")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    loggerInfo("Resultado da validação da sessão", { session, sessionError });

    return {
      exists: !!session && !sessionError,
      session,
      error: sessionError,
    };
  }
}
