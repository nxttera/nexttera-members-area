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

    const chapterId = parseInt(getRouterParam(event, "chapterId") || "0");

    if (!chapterId || chapterId <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid chapter ID",
      });
    }

    const supabase = serverSupabaseServiceRole(event);

    const { data: missions, error } = await supabase
      .from("missions")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("order_number");

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch missions: ${error.message}`,
      });
    }

    return {
      data: missions || [],
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal server error",
    });
  }
});
