import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChatMessage } from "~/shared/types/chat.types";
import { loggerError, loggerInfo } from "~/shared/utils/logger";
import { createError } from "h3";

export class ChatMessagesService {
  constructor(private supabase: SupabaseClient) {}

  async getMessagesBySession(
    sessionId: string,
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    try {
      loggerInfo("Iniciando busca de mensagens por sessão", {
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

      if (sessionError || !session) {
        loggerError("Erro ao validar sessão de chat", {
          sessionError: sessionError?.message,
          sessionId,
          userId,
          code: sessionError?.code,
        });

        throw createError({
          statusCode: sessionError?.code === "PGRST116" ? 404 : 403,
          statusMessage: "Sessão não encontrada ou não autorizada",
        });
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
        loggerError("Erro do Supabase ao buscar mensagens", {
          sessionId,
          userId,
          page,
          limit,
          error: messagesError.message,
          code: messagesError.code,
          details: messagesError.details,
        });

        if (messagesError.message?.includes("range not satisfiable")) {
          return {
            messages: [],
            hasMore: false,
            totalMessages: 0,
            currentPage: page,
            totalPages: 0,
          };
        }

        throw createError({
          statusCode: 500,
          statusMessage: `Erro ao buscar mensagens: ${messagesError.message}`,
        });
      }

      const hasMore = count ? startIndex + limit < count : false;

      loggerInfo("Mensagens da sessão encontradas com sucesso", {
        sessionId,
        userId,
        messagesCount: messages?.length || 0,
        totalMessages: count || 0,
        hasMore,
        currentPage: page,
      });

      return {
        messages: (messages || []).reverse(),
        hasMore,
        totalMessages: count || 0,
        currentPage: page,
        totalPages: count ? Math.ceil(count / limit) : 0,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao buscar mensagens da sessão", {
        sessionId,
        userId,
        page,
        limit,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async createUserMessage(sessionId: string, userId: string, content: string) {
    try {
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

      if (sessionError || !session) {
        loggerError("Erro ao validar sessão para criação de mensagem", {
          sessionError: sessionError?.message,
          sessionId,
          userId,
          code: sessionError?.code,
        });

        throw createError({
          statusCode: sessionError?.code === "PGRST116" ? 404 : 403,
          statusMessage: "Sessão não encontrada ou não autorizada",
        });
      }

      const userMessage = {
        session_id: sessionId,
        type: "user" as const,
        content,
        metadata: null,
      };

      const { data: createdMessage, error: messageError } = await this.supabase
        .from("chat_messages")
        .insert(userMessage)
        .select()
        .single();

      if (messageError) {
        loggerError("Erro do Supabase ao inserir mensagem do usuário", {
          sessionId,
          userId,
          error: messageError.message,
          code: messageError.code,
          details: messageError.details,
          hint: messageError.hint,
        });

        throw createError({
          statusCode: 500,
          statusMessage:
            `Erro ao criar mensagem do usuário: ${messageError.message}`,
        });
      }

      await this.updateSessionLastMessage(sessionId);

      loggerInfo("Mensagem do usuário criada com sucesso", {
        sessionId,
        userId,
        messageId: createdMessage.id,
        contentLength: createdMessage.content.length,
      });

      return createdMessage;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao criar mensagem do usuário", {
        sessionId,
        userId,
        contentLength: content.length,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async createBotMessage(
    sessionId: string,
    content: string,
    metadata?: Record<string, unknown>,
  ) {
    try {
      loggerInfo("Criando mensagem do bot", {
        sessionId,
        contentLength: content.length,
        hasMetadata: !!metadata,
      });

      const botMessage = {
        session_id: sessionId,
        type: "bot" as const,
        content,
        metadata: metadata || null,
      };

      const { data: createdMessage, error: messageError } = await this.supabase
        .from("chat_messages")
        .insert(botMessage)
        .select()
        .single();

      if (messageError) {
        loggerError("Erro do Supabase ao inserir mensagem do bot", {
          sessionId,
          error: messageError.message,
          code: messageError.code,
          details: messageError.details,
          hint: messageError.hint,
        });

        throw createError({
          statusCode: 500,
          statusMessage:
            `Erro ao criar mensagem do bot: ${messageError.message}`,
        });
      }

      await this.updateSessionLastMessage(sessionId);

      loggerInfo("Mensagem do bot criada com sucesso", {
        sessionId,
        messageId: createdMessage.id,
        contentLength: createdMessage.content.length,
      });

      return createdMessage;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao criar mensagem do bot", {
        sessionId,
        contentLength: content.length,
        hasMetadata: !!metadata,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
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
        error: error.message,
        code: error.code,
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
    try {
      loggerInfo("Validando se sessão existe", { sessionId, userId });

      const { data: session, error: sessionError } = await this.supabase
        .from("chat_sessions")
        .select("id, user_id, tool_id, title, created_at")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single();

      const exists = !!session && !sessionError;

      loggerInfo("Resultado da validação da sessão", {
        sessionId,
        userId,
        exists,
        error: sessionError?.message,
      });

      return {
        exists,
        session,
        error: sessionError,
      };
    } catch (error) {
      loggerError("Erro inesperado ao validar sessão", {
        sessionId,
        userId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      return {
        exists: false,
        session: null,
        error: "Erro interno na validação",
      };
    }
  }
}
