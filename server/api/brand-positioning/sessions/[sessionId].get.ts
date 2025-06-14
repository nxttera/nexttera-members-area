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

  const { data: session, error } = await supabase
    .from("brand_positioning_sessions")
    .select(`
      id,
      title,
      status,
      created_at,
      total_progress
    `)
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (error || !session) {
    throw createError({
      statusCode: 404,
      statusMessage: "Sessão não encontrada",
    });
  }

  return {
    success: true,
    data: session,
  };
});
