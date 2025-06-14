import type { ChatMessage } from "~/shared/types/chat.types";
import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { loggerError, loggerInfo } from "~/shared/utils/logger";
import { ChatMessagesService } from "~/server/services/chatMessagesService";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Não autorizado",
    });
  }

  try {
    const sessionId = event.context.params?.id;
    const query = getQuery(event);

    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;

    if (!sessionId) {
      throw createError({
        statusCode: 400,
        message: "ID da sessão é obrigatório",
      });
    }

    loggerInfo("Carregando mensagens da sessão", {
      sessionId,
      userId: user.id,
      page,
      limit,
    });

    const supabase = serverSupabaseServiceRole(event);
    const messagesService = new ChatMessagesService(supabase);

    const result = await messagesService.getMessagesBySession(
      sessionId,
      user.id,
      page,
      limit,
    );

    loggerInfo("Mensagens carregadas com sucesso", {
      sessionId,
      messagesCount: result.messages.length,
      page,
      hasMore: result.hasMore,
      totalMessages: result.totalMessages,
    });

    return {
      statusCode: 200,
      ...result,
    };
  } catch (error) {
    const sessionId = event.context.params?.id;
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;

    loggerError("Erro ao carregar mensagens da sessão", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      sessionId,
      userId: user.id,
      page,
      limit,
    });

    if (error instanceof Error && error.message.includes("não encontrada")) {
      throw createError({
        statusCode: 404,
        message: "Sessão não encontrada",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Erro ao carregar mensagens da sessão",
    });
  }
});
