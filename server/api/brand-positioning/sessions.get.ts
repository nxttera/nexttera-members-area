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

  const { data: sessions, error } = await supabase
    .from("brand_positioning_sessions")
    .select(`
      id,
      title,
      status,
      created_at,
      total_progress
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao buscar sessões",
    });
  }

  return {
    success: true,
    data: sessions,
  };
});
