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

  const body = await readBody(event);

  const { data: session, error } = await (supabase as any)
    .from("brand_positioning_sessions")
    .insert({
      user_id: user.id,
      title: body.title || "Nova Sessão de Posicionamento",
      status: "draft",
      total_progress: 0,
    })
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao criar sessão",
    });
  }

  return {
    success: true,
    data: session,
  };
});
