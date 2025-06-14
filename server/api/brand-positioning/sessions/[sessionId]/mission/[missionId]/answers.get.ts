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

  if (!sessionId || !missionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "IDs da sessão e missão são obrigatórios",
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

  // Busca as respostas para essas perguntas
  const { data: answers, error } = await supabase
    .from("session_answers")
    .select("question_id, answer")
    .eq("session_id", sessionId)
    .in("question_id", questionIds);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao buscar respostas",
    });
  }

  // Transformar array em objeto para facilitar o uso no frontend
  const answersObject = (answers || []).reduce((acc: any, answer: any) => {
    acc[answer.question_id] = answer.answer;
    return acc;
  }, {});

  return {
    success: true,
    data: answersObject,
  };
});
