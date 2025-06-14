import { serverSupabaseServiceRole } from "#supabase/server";
import type { TensorZeroModel } from "~/shared/types/tensorzero";

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const body = await readBody(event);

  const modelData: Omit<TensorZeroModel, "id" | "created_at"> = {
    name: body.name,
    provider: body.provider,
    model_type: body.model_type,
    api_key_field: body.api_key_field,
    max_tokens: body.max_tokens,
    temperature: body.temperature,
    is_active: body.is_active ?? true,
  };

  const { data: model, error } = await supabase
    .from("tensorzero_models")
    .insert([{
      ...modelData,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return model;
});
