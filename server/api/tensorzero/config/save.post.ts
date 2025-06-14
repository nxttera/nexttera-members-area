import { serverSupabaseServiceRole } from "#supabase/server";
import { TensorZeroConfigService } from "~/server/services/tensorZeroConfigService";
import { loggerError } from "~/shared/utils/logger";

export default defineEventHandler(async (event) => {
  const {
    functions: functionsData,
    variants: variantsData,
    userId,
    generateFile = true,
    filePath = "tensorzero/tensorzero.toml",
  } = await readBody(event);

  if (!functionsData || !Array.isArray(functionsData)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Functions data is required and must be an array",
    });
  }

  if (!variantsData || !Array.isArray(variantsData)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Variants data is required and must be an array",
    });
  }

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  try {
    const supabase = serverSupabaseServiceRole(event);
    const configService = new TensorZeroConfigService(supabase);

    const savedFunctions = [];
    const savedVariants = [];

    for (const functionData of functionsData) {
      const newFunction = await configService.createFunction({
        ...functionData,
        user_id: userId,
      });
      savedFunctions.push(newFunction);
    }

    for (const variantData of variantsData) {
      const functionId = savedFunctions.find((f) =>
        f.name === variantData.function_name
      )?.id;

      if (!functionId) {
        throw createError({
          statusCode: 400,
          statusMessage: `Function not found for variant: ${variantData.name}`,
        });
      }

      const { data: model, error: modelError } = await (supabase as any)
        .from("tensorzero_models")
        .select("id")
        .eq("name", variantData.model_name)
        .single();

      if (modelError || !model) {
        throw createError({
          statusCode: 400,
          statusMessage: `Model not found: ${variantData.model_name}`,
        });
      }

      const newVariant = await configService.createVariant({
        function_id: functionId,
        model_id: model.id,
        name: variantData.name,
        type: variantData.type,
        weight: variantData.weight || 1,
        system_prompt: variantData.system_prompt,
        user_prompt: variantData.user_prompt,
        json_schema: variantData.json_schema,
        is_active: true,
      });
      savedVariants.push(newVariant);
    }

    let tomlContent = null;
    let savedFilePath = null;

    if (generateFile) {
      await configService.loadFromDatabase();
      tomlContent = configService.buildTomlConfig();

      const saveResult = await $fetch("/api/tensorzero/config", {
        method: "POST",
        body: {
          content: tomlContent,
          filePath,
        },
      });
      savedFilePath = saveResult.filePath;
    }

    return {
      success: true,
      message: "Configuração TensorZero salva com sucesso",
      data: {
        functions: savedFunctions,
        variants: savedVariants,
        tomlContent,
        filePath: savedFilePath,
      },
    };
  } catch (error: any) {
    loggerError("Erro ao salvar configuração TensorZero", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao salvar configuração: ${error.message}`,
    });
  }
});
