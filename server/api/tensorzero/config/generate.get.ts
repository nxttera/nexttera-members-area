import { serverSupabaseServiceRole } from "#supabase/server";
import { TensorZeroConfigService } from "~/server/services/tensorZeroConfigService";

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event);
    const configService = new TensorZeroConfigService(supabase);

    await configService.loadFromDatabase();
    const tomlConfig = configService.buildTomlConfig();

    return {
      config: tomlConfig,
      message: "Configuração gerada com sucesso",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao gerar configuração: ${error.message}`,
    });
  }
});
