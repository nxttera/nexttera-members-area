import { serverSupabaseServiceRole } from "#supabase/server";
import type {
  BrandPositioningResponse,
  BrandPositioningSession,
  Chapter,
  CreateSessionRequest,
  Mission,
  MissionWithQuestions,
  Question,
  SaveAnswersRequest,
  SessionAnswer,
  SessionProgress,
  SessionWithProgress,
  UpdateProgressRequest,
} from "~/shared/types";

export const brandPositioningService = {
  async createSession(
    userId: string,
    data: CreateSessionRequest,
  ): Promise<BrandPositioningSession> {
    const supabase = serverSupabaseServiceRole();

    const { data: session, error } = await supabase
      .from("brand_positioning_sessions")
      .insert({
        user_id: userId,
        title: data.title,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create session: ${error.message}`,
      });
    }

    return session;
  },

  async getUserSessions(userId: string): Promise<BrandPositioningSession[]> {
    const supabase = serverSupabaseServiceRole();

    const { data: sessions, error } = await supabase
      .from("brand_positioning_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch sessions: ${error.message}`,
      });
    }

    return sessions || [];
  },

  async getSessionById(
    sessionId: string,
    userId: string,
  ): Promise<SessionWithProgress> {
    const supabase = serverSupabaseServiceRole();

    const { data: session, error } = await supabase
      .from("brand_positioning_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw createError({
        statusCode: error.code === "PGRST116" ? 404 : 500,
        statusMessage: error.code === "PGRST116"
          ? "Session not found"
          : `Failed to fetch session: ${error.message}`,
      });
    }

    const answeredCount = await this.getAnsweredQuestionsCount(sessionId);
    const totalCount = await this.getTotalQuestionsCount();
    const chapterProgress = await this.getChapterProgress(sessionId);

    return {
      ...session,
      answered_questions_count: answeredCount,
      total_questions_count: totalCount,
      chapter_progress: chapterProgress,
    };
  },

  async getAllChapters(): Promise<Chapter[]> {
    const supabase = serverSupabaseServiceRole();

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

    return chapters || [];
  },

  async getChapterMissions(chapterId: number): Promise<Mission[]> {
    const supabase = serverSupabaseServiceRole();

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

    return missions || [];
  },

  async getMissionQuestions(missionId: number): Promise<Question[]> {
    const supabase = serverSupabaseServiceRole();

    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("mission_id", missionId)
      .order("order_number");

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch questions: ${error.message}`,
      });
    }

    return (questions || []).map((q: any) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : undefined,
    }));
  },

  async getMissionWithQuestions(
    missionId: number,
  ): Promise<MissionWithQuestions> {
    const supabase = serverSupabaseServiceRole();

    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("*")
      .eq("id", missionId)
      .single();

    if (missionError) {
      throw createError({
        statusCode: missionError.code === "PGRST116" ? 404 : 500,
        statusMessage: missionError.code === "PGRST116"
          ? "Mission not found"
          : `Failed to fetch mission: ${missionError.message}`,
      });
    }

    const questions = await this.getMissionQuestions(missionId);

    return {
      ...mission,
      questions,
    };
  },

  async saveAnswers(
    sessionId: string,
    userId: string,
    data: SaveAnswersRequest,
  ): Promise<void> {
    const supabase = serverSupabaseServiceRole();

    const session = await this.getSessionById(sessionId, userId);
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: "Session not found",
      });
    }

    const answersToInsert = Object.entries(data.answers).map(
      ([questionId, answer]) => ({
        session_id: sessionId,
        question_id: parseInt(questionId),
        answer,
      }),
    );

    const { error } = await supabase
      .from("session_answers")
      .upsert(answersToInsert, {
        onConflict: "session_id,question_id",
      });

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save answers: ${error.message}`,
      });
    }
  },

  async getSessionAnswers(sessionId: string): Promise<Record<number, string>> {
    const supabase = serverSupabaseServiceRole();

    const { data: answers, error } = await supabase
      .from("session_answers")
      .select("question_id, answer")
      .eq("session_id", sessionId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch answers: ${error.message}`,
      });
    }

    return (answers || []).reduce(
      (acc: Record<number, string>, answer: any) => {
        acc[answer.question_id] = answer.answer;
        return acc;
      },
      {} as Record<number, string>,
    );
  },

  async updateProgress(
    sessionId: string,
    userId: string,
    data: UpdateProgressRequest,
  ): Promise<void> {
    const supabase = serverSupabaseServiceRole();

    const session = await this.getSessionById(sessionId, userId);
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: "Session not found",
      });
    }

    const { error } = await supabase.from("session_progress").upsert(
      {
        session_id: sessionId,
        chapter_id: data.chapterId,
        mission_id: data.missionId,
        is_mission_completed: true,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "session_id,chapter_id,mission_id",
      },
    );

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update progress: ${error.message}`,
      });
    }

    await this.updateSessionProgress(sessionId);
  },

  async updateSessionProgress(sessionId: string): Promise<void> {
    const supabase = serverSupabaseServiceRole();

    const { error } = await supabase.rpc("calculate_session_progress", {
      session_uuid: sessionId,
    });

    if (error) {
      console.error("Failed to update session progress:", error);
    }
  },

  async getAnsweredQuestionsCount(sessionId: string): Promise<number> {
    const supabase = serverSupabaseServiceRole();

    const { count, error } = await supabase
      .from("session_answers")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId);

    if (error) {
      console.error("Failed to get answered questions count:", error);
      return 0;
    }

    return count || 0;
  },

  async getTotalQuestionsCount(): Promise<number> {
    const supabase = serverSupabaseServiceRole();

    const { count, error } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to get total questions count:", error);
      return 0;
    }

    return count || 0;
  },

  async getChapterProgress(sessionId: string): Promise<
    Array<{
      chapter_id: number;
      completed_missions: number;
      total_missions: number;
      is_completed: boolean;
    }>
  > {
    const supabase = serverSupabaseServiceRole();

    const { data, error } = await supabase.rpc("get_chapter_progress", {
      session_uuid: sessionId,
    });

    if (error) {
      console.error("Failed to get chapter progress:", error);
      return [];
    }

    return data || [];
  },
};
