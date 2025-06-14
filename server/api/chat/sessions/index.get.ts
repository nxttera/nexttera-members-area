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
    const query = getQuery(event);
    const toolId = query.toolId as string;

    loggerInfo("Carregando sessões de chat", { userId: user.id, toolId });

    const supabase = serverSupabaseServiceRole(event);

    let queryBuilder = supabase
      .from("chat_sessions")
      .select(`
        id,
        user_id,
        tool_id,
        title,
        is_active,
        last_message_at,
        created_at,
        updated_at
      `)
      .eq("user_id", user.id)
      .order("last_message_at", { ascending: false });

    if (toolId) {
      queryBuilder = queryBuilder.eq("tool_id", toolId);
    }

    const { data: sessionsData, error } = await queryBuilder;

    if (error) {
      loggerError("Erro ao buscar sessões no banco", {
        error,
        userId: user.id,
      });
      throw createError({
        statusCode: 500,
        message: "Erro ao buscar sessões no banco de dados",
      });
    }

    const sessions = sessionsData || [];

    loggerInfo("Sessões carregadas com sucesso", {
      count: sessions.length,
    });

    return {
      statusCode: 200,
      sessions,
    };
  } catch (error) {
    loggerError("Erro ao listar sessões", { error, userId: user.id });
    throw createError({
      statusCode: 500,
      message: "Erro ao carregar sessões de chat",
    });
  }
});
