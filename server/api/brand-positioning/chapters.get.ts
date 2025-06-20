import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { BrandPositioningService } from "~/server/services/brandPositioningService";

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
    const brandPositioningService = new BrandPositioningService(supabase);

    const chapters = await brandPositioningService.getAllChapters();

    const chaptersWithCounts = await Promise.all(
      chapters.map(async (chapter: any) => {
        const missions = await brandPositioningService.getChapterMissions(
          chapter.id,
        );
        return {
          ...chapter,
          missions_count: missions.length,
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
