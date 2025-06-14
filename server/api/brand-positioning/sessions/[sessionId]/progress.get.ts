import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  const supabase = serverSupabaseServiceRole(event);
  const sessionId = getRouterParam(event, "sessionId");

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID da sessão é obrigatório",
    });
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("parent_id")
    .eq("id", user.id)
    .single();

  if ((userProfile as any)?.parent_id) {
    throw createError({
      statusCode: 403,
      statusMessage: "Acesso restrito apenas para usuários principais",
    });
  }

  // Verifica se a sessão pertence ao usuário
  const { data: session, error: sessionError } = await supabase
    .from("brand_positioning_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sessão não encontrada",
    });
  }

  // Buscar todos os capítulos
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, order_number")
    .order("order_number");

  if (!chapters) {
    return {
      success: true,
      data: {},
    };
  }

  const chapterProgress: Record<number, number> = {};

  // Calcular progresso para cada capítulo
  for (const chapter of chapters) {
    const chapterOrder = (chapter as any).order_number;

    // Buscar todas as missões do capítulo
    const { data: missions } = await supabase
      .from("missions")
      .select("id")
      .eq("chapter_id", (chapter as any).id);

    if (!missions || missions.length === 0) {
      chapterProgress[chapterOrder] = 0;
      continue;
    }

    const missionIds = missions.map((m: any) => m.id);

    // Contar total de perguntas no capítulo
    const { data: totalQuestions } = await supabase
      .from("questions")
      .select("id")
      .in("mission_id", missionIds);

    const totalCount = totalQuestions?.length || 0;

    if (totalCount === 0) {
      chapterProgress[chapterOrder] = 0;
      continue;
    }

    // Contar respostas dadas para este capítulo
    const { data: answeredQuestions } = await supabase
      .from("session_answers")
      .select("id")
      .eq("session_id", sessionId)
      .in("mission_id", missionIds);

    const answeredCount = answeredQuestions?.length || 0;

    // Calcular percentual
    chapterProgress[chapterOrder] = Math.round(
      (answeredCount / totalCount) * 100,
    );
  }

  return {
    success: true,
    data: chapterProgress,
  };
});
