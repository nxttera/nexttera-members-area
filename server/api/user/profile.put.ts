import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Usuário não autenticado",
    });
  }

  const body = await readBody(event);
  const supabase = serverSupabaseServiceRole(event);

  // Validate and sanitize the body data
  const allowedFields = ["name", "company", "phone", "onboarding_completed"];
  const updateData: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (allowedFields.includes(key)) {
      updateData[key] = value;
    }
  }

  updateData.updated_at = new Date().toISOString();

  const { data: updatedProfile, error } = await (supabase as any)
    .from("user_profiles")
    .update(updateData)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao atualizar perfil",
    });
  }

  return updatedProfile;
});
