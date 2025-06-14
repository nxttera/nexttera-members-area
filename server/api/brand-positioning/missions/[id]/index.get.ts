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

  const { data: mission, error } = await supabase
    .from("missions")
    .select(`
      id,
      title,
      description,
      order_number,
      chapter_id,
      chapters (
        id,
        title,
        description,
        order_number
      )
    `)
    .eq("id", missionId)
    .single();

  if (error || !mission) {
    throw createError({
      statusCode: 404,
      statusMessage: "Missão não encontrada",
    });
  }

  return {
    success: true,
    data: mission,
    chapter: (mission as any).chapters,
  };
});
