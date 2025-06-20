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

  const body = await readBody(event);

  const session = await brandPositioningService.createSession(user.id, {
    title: body.title || "Nova Sessão de Posicionamento",
  });

  return {
    success: true,
    data: session,
  };
});
