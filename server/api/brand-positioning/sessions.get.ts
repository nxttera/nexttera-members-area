import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { BrandPositioningService } from "~/server/services/brandPositioningService";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  const supabase = serverSupabaseServiceRole(event);
  const brandPositioningService = new BrandPositioningService(supabase);

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

  const sessions = await brandPositioningService.getUserSessions(user.id);

  return {
    success: true,
    data: sessions,
  };
});
