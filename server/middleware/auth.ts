import type { H3Event } from "h3";
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Usuário não autenticado",
      });
    }
    event.context.user = user;
  } catch (error) {
    console.error(error);
  }
});
