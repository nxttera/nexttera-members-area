import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { UserProfileService } from "~/server/services/userProfileService";

export default defineEventHandler(async (event) => {
  const user = event.context.user || (await serverSupabaseUser(event));

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Usuário não autenticado",
    });
  }

  const body = await readBody(event);

  const supabase = serverSupabaseServiceRole(event);
  const userProfileService = new UserProfileService(supabase);

  return await userProfileService.updateUserProfile(user.id, body);
});
