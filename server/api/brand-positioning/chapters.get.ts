import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  try {
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Authentication required",
      });
    }

    const userMetadata = user.user_metadata || {};
    const parentId = userMetadata.parent_id;

    if (parentId !== null && parentId !== undefined) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Only master users can access Brand Positioning features",
      });
    }

    const supabase = serverSupabaseServiceRole(event);

    const { data: chapters, error } = await supabase
      .from("chapters")
      .select("*")
      .order("order_number");

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch chapters: ${error.message}`,
      });
    }

    // Adicionar contagem de missões para cada capítulo
    const chaptersWithCounts = await Promise.all(
      (chapters || []).map(async (chapter: any) => {
        const { data: missions } = await supabase
          .from("missions")
          .select("id")
          .eq("chapter_id", chapter.id);

        return {
          ...chapter,
          missions_count: missions?.length || 0,
        };
      }),
    );

    return {
      data: chaptersWithCounts,
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal server error",
    });
  }
});
