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
    const sessionId = event.context.params?.id;

    if (!sessionId) {
      throw createError({
        statusCode: 400,
        message: "ID da sessão é obrigatório",
      });
    }

    loggerInfo("Excluindo sessão de chat", { sessionId, userId: user.id });

    const supabase = serverSupabaseServiceRole(event);

    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) {
      loggerError("Erro ao excluir sessão do banco", {
        error,
        sessionId,
        userId: user.id,
      });
      throw createError({
        statusCode: 500,
        message: "Erro ao excluir sessão do banco de dados",
      });
    }

    loggerInfo("Sessão excluída com sucesso", { sessionId });

    return {
      statusCode: 200,
      success: true,
      message: "Sessão excluída com sucesso",
    };
  } catch (error) {
    loggerError("Erro ao excluir sessão", { error, userId: user.id });
    throw createError({
      statusCode: 500,
      message: "Erro ao excluir sessão de chat",
    });
  }
});
