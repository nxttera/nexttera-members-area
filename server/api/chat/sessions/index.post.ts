import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { loggerError, loggerInfo } from "~/shared/utils/logger";

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

    if (!body.toolId) {
      throw createError({
        statusCode: 400,
        message: "O ID da ferramenta é obrigatório",
      });
    }

    loggerInfo("Criando nova sessão de chat", {
      userId: user.id,
      toolId: body.toolId,
    });

    const supabase = serverSupabaseServiceRole(event);

    const { data: newSession, error } = await (supabase as any)
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        tool_id: body.toolId,
        title: body.title ||
          `Nova conversa - ${new Date().toLocaleDateString("pt-BR")}`,
        is_active: true,
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      loggerError("Erro ao criar sessão no banco", { error, userId: user.id });
      throw createError({
        statusCode: 500,
        message: "Erro ao criar sessão no banco de dados",
      });
    }

    loggerInfo("Sessão criada com sucesso", {
      sessionId: (newSession as any).id,
    });

    return {
      statusCode: 201,
      session: newSession,
    };
  } catch (error) {
    loggerError("Erro ao criar sessão", { error, userId: user.id });
    throw createError({
      statusCode: 500,
      message: "Erro ao criar nova sessão de chat",
    });
  }
});
