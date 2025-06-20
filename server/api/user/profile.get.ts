import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = event.context.user || (await serverSupabaseUser(event));

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Usuário não autenticado",
    });
  }

  const supabase = serverSupabaseServiceRole(event);

  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Perfil não encontrado",
    });
  }

  return userProfile;
});
