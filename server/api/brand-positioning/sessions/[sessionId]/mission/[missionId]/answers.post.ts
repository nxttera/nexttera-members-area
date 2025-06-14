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
  const missionId = getRouterParam(event, "missionId");
  const body = await readBody(event);

  if (!sessionId || !missionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs da sessão e missão são obrigatórios",
    });
  }

  if (!body.answers) {
    throw createError({
      statusCode: 400,
      statusMessage: "Respostas são obrigatórias",
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

  // Primeiro, busca as perguntas desta missão
  const { data: missionQuestions } = await supabase
    .from("questions")
    .select("id")
    .eq("mission_id", missionId);

  const questionIds = (missionQuestions || []).map((q: any) => q.id);

  // Remove respostas existentes desta missão
  if (questionIds.length > 0) {
    await (supabase as any)
      .from("session_answers")
      .delete()
      .eq("session_id", sessionId)
      .in("question_id", questionIds);
  }

  // Depois insere as novas respostas
  const answersToInsert = Object.entries(body.answers).map((
    [questionId, answerValue],
  ) => ({
    session_id: sessionId,
    question_id: parseInt(questionId),
    answer: answerValue,
    answered_at: new Date().toISOString(),
  }));

  if (answersToInsert.length > 0) {
    const { error: insertError } = await (supabase as any)
      .from("session_answers")
      .insert(answersToInsert);

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao salvar respostas",
      });
    }
  }

  // Atualizar progresso da sessão
  await updateSessionProgress(supabase, sessionId);

  return {
    success: true,
    message: "Respostas salvas com sucesso",
  };
});

async function updateSessionProgress(supabase: any, sessionId: string) {
  try {
    // Primeiro, buscar todas as missões
    const { data: missions } = await supabase
      .from("missions")
      .select("id");

    if (!missions || missions.length === 0) {
      console.warn("Nenhuma missão encontrada");
      return;
    }

    const missionIds = missions.map((m: any) => m.id);

    // Contar total de perguntas de todas as missões
    const { data: totalQuestions, count: totalCount } = await supabase
      .from("questions")
      .select("id", { count: "exact" })
      .in("mission_id", missionIds);

    // Contar respostas dadas nesta sessão
    const { data: answeredQuestions, count: answeredCount } = await supabase
      .from("session_answers")
      .select("id", { count: "exact" })
      .eq("session_id", sessionId);

    const progress = (totalCount && totalCount > 0)
      ? Math.round(((answeredCount || 0) / totalCount) * 100)
      : 0;

    // Atualizar progresso
    await supabase
      .from("brand_positioning_sessions")
      .update({
        total_progress: progress,
        status: progress === 100 ? "completed" : "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    console.log(
      `Progresso atualizado: ${answeredCount || 0}/${
        totalCount || 0
      } = ${progress}%`,
    );
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error);
  }
}
