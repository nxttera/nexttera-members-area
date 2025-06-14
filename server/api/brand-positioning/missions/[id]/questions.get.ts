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
  const missionId = getRouterParam(event, "id");

  if (!missionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID da missão é obrigatório",
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

  const { data: questions, error } = await supabase
    .from("questions")
    .select(`
      id,
      text,
      description,
      question_type,
      is_required,
      options,
      order_number
    `)
    .eq("mission_id", missionId)
    .order("order_number");

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao buscar perguntas",
    });
  }

  return {
    success: true,
    data: questions || [],
  };
});
