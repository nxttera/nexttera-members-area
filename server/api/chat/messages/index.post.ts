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
    const body = await readBody(event);

    if (!body.sessionId) {
      throw createError({
        statusCode: 400,
        message: "ID da sessão é obrigatório",
      });
    }

    if (!body.content) {
      throw createError({
        statusCode: 400,
        message: "Conteúdo da mensagem é obrigatório",
      });
    }

    loggerInfo("Enviando mensagem", {
      sessionId: body.sessionId,
      userId: user.id,
      contentLength: body.content.length,
    });

    const supabase = serverSupabaseServiceRole(event);
    const messagesService = new ChatMessagesService(supabase);

    const sessionValidation = await messagesService.validateSessionExists(
      body.sessionId,
      user.id,
    );

    if (!sessionValidation.exists) {
      loggerError("Sessão não encontrada para criação de mensagem", {
        sessionId: body.sessionId,
        userId: user.id,
        validationError: sessionValidation.error,
      });
      throw createError({
        statusCode: 404,
        message: "Sessão não encontrada ou não autorizada",
      });
    }

    const userMessage = await messagesService.createUserMessage(
      body.sessionId,
      user.id,
      body.content,
    );

    const botResponseContent = await messagesService.simulateBotResponse(
      body.content,
    );

    const botMessage = await messagesService.createBotMessage(
      body.sessionId,
      botResponseContent,
    );

    loggerInfo("Mensagem enviada com sucesso", {
      sessionId: body.sessionId,
      userMessageId: userMessage.id,
      botMessageId: botMessage.id,
    });

    return {
      statusCode: 201,
      userMessage,
      botMessage,
    };
  } catch (error) {
    loggerError("Erro ao enviar mensagem", {
      error,
      userId: user.id,
    });
    throw createError({
      statusCode: 500,
      message: "Erro ao processar mensagem",
    });
  }
});
