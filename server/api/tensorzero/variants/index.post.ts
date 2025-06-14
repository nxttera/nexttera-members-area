import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const body = await readBody(event);

  const variantData = {
    function_id: body.function_id,
    model_id: body.model_id,
    name: body.name,
    type: body.type,
    weight: body.weight ?? 1,
    system_prompt: body.system_prompt,
    user_prompt: body.user_prompt,
    json_schema: body.json_schema,
    is_active: body.is_active ?? true,
  };

  const { data: newVariant, error } = await (supabase as any)
    .from("tensorzero_variants")
    .insert(variantData)
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return newVariant;
});
