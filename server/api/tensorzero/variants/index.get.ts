import { serverSupabaseServiceRole } from "#supabase/server";
import { loggerError } from "~/shared/utils/logger";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const functionId = query.functionId as string;

  try {
    const supabase = serverSupabaseServiceRole(event);

    let queryBuilder = (supabase as any)
      .from("tensorzero_variants")
      .select(`
        *,
        tensorzero_models!inner(name, provider, model_type),
        tensorzero_functions!inner(name)
      `)
      .eq("is_active", true);

    if (functionId) {
      queryBuilder = queryBuilder.eq("function_id", functionId);
    }

    const { data: variants, error } = await queryBuilder;

    if (error) {
      loggerError("Erro ao buscar variants no banco", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }

    const formattedVariants = variants?.map((variant: any) => ({
      ...variant,
      model_name: variant.tensorzero_models.name,
      model_provider: variant.tensorzero_models.provider,
      model_type: variant.tensorzero_models.model_type,
      function_name: variant.tensorzero_functions.name,
    })) || [];

    return formattedVariants;
  } catch (error: any) {
    loggerError("Erro ao listar variants TensorZero", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao buscar variants: ${error.message}`,
    });
  }
});
