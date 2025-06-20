import type { SupabaseClient } from "@supabase/supabase-js";
import { loggerError, loggerInfo } from "~/shared/utils/logger";
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

export class BrandPositioningService {
  constructor(private supabase: SupabaseClient) {}

  async createSession(
    userId: string,
    data: CreateSessionRequest,
  ): Promise<BrandPositioningSession> {
    try {
      loggerInfo("Iniciando criação de sessão de brand positioning", {
        userId,
        title: data.title,
      });

      const { data: session, error } = await (this.supabase as any)
        .from("brand_positioning_sessions")
        .insert({
          user_id: userId,
          title: data.title,
          status: "draft",
        })
        .select()
        .single();

      if (error) {
        loggerError("Erro do Supabase ao criar sessão", {
          userId,
          title: data.title,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        throw createError({
          statusCode: 500,
          statusMessage: `Failed to create session: ${error.message}`,
        });
      }

      loggerInfo("Sessão de brand positioning criada com sucesso", {
        userId,
        sessionId: session.id,
        title: session.title,
        status: session.status,
      });

      return session;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao criar sessão", {
        userId,
        title: data.title,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async getUserSessions(userId: string): Promise<BrandPositioningSession[]> {
    try {
      loggerInfo("Buscando sessões do usuário", { userId });

      const { data: sessions, error } = await this.supabase
        .from("brand_positioning_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        loggerError("Erro do Supabase ao buscar sessões do usuário", {
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        throw createError({
          statusCode: 500,
          statusMessage: `Failed to fetch sessions: ${error.message}`,
        });
      }

      loggerInfo("Sessões do usuário encontradas", {
        userId,
        sessionsCount: sessions?.length || 0,
      });

      return sessions || [];
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao buscar sessões do usuário", {
        userId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async getSessionById(
    sessionId: string,
    userId: string,
  ): Promise<SessionWithProgress> {
    try {
      loggerInfo("Buscando sessão por ID", { sessionId, userId });

      const { data: session, error } = await this.supabase
        .from("brand_positioning_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .single();

      if (error) {
        loggerError("Erro do Supabase ao buscar sessão por ID", {
          sessionId,
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

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

      loggerInfo("Sessão encontrada com progresso calculado", {
        sessionId,
        userId,
        answeredCount,
        totalCount,
        chapterProgressCount: chapterProgress.length,
      });

      return {
        ...session,
        answered_questions_count: answeredCount,
        total_questions_count: totalCount,
        chapter_progress: chapterProgress,
      };
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao buscar sessão por ID", {
        sessionId,
        userId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async getAllChapters(): Promise<Chapter[]> {
    const { data: chapters, error } = await this.supabase
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
  }

  async getChapterMissions(chapterId: number): Promise<Mission[]> {
    const { data: missions, error } = await this.supabase
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
  }

  async getMissionQuestions(missionId: number): Promise<Question[]> {
    const { data: questions, error } = await this.supabase
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
  }

  async getMissionWithQuestions(
    missionId: number,
  ): Promise<MissionWithQuestions> {
    const { data: mission, error: missionError } = await this.supabase
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
  }

  async saveAnswers(
    sessionId: string,
    userId: string,
    data: SaveAnswersRequest,
  ): Promise<void> {
    try {
      loggerInfo("Iniciando salvamento de respostas", {
        sessionId,
        userId,
        answersCount: Object.keys(data.answers).length,
      });

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

      loggerInfo("Dados de resposta preparados para inserção", {
        sessionId,
        userId,
        answersToInsert: answersToInsert.length,
        questionIds: answersToInsert.map((a) => a.question_id),
      });

      const { error } = await (this.supabase as any)
        .from("session_answers")
        .upsert(answersToInsert, {
          onConflict: "session_id,question_id",
        });

      if (error) {
        loggerError("Erro do Supabase ao salvar respostas", {
          sessionId,
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          answersCount: answersToInsert.length,
        });

        throw createError({
          statusCode: 500,
          statusMessage: `Failed to save answers: ${error.message}`,
        });
      }

      loggerInfo("Respostas salvas com sucesso", {
        sessionId,
        userId,
        savedAnswers: answersToInsert.length,
      });
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao salvar respostas", {
        sessionId,
        userId,
        answersCount: Object.keys(data.answers).length,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }

  async getSessionAnswers(sessionId: string): Promise<Record<number, string>> {
    const { data: answers, error } = await this.supabase
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
  }

  async updateProgress(
    sessionId: string,
    userId: string,
    data: UpdateProgressRequest,
  ): Promise<void> {
    const session = await this.getSessionById(sessionId, userId);
    if (!session) {
      throw createError({
        statusCode: 404,
        statusMessage: "Session not found",
      });
    }

    const { error } = await (this.supabase as any).from("session_progress")
      .upsert(
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
  }

  async updateSessionProgress(sessionId: string): Promise<void> {
    const { error } = await (this.supabase as any).rpc(
      "calculate_session_progress",
      {
        session_uuid: sessionId,
      },
    );

    if (error) {
      console.error("Failed to update session progress:", error);
    }
  }

  async getAnsweredQuestionsCount(sessionId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("session_answers")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionId);

    if (error) {
      console.error("Failed to get answered questions count:", error);
      return 0;
    }

    return count || 0;
  }

  async getTotalQuestionsCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from("questions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Failed to get total questions count:", error);
      return 0;
    }

    return count || 0;
  }

  async getChapterProgress(sessionId: string): Promise<
    Array<{
      chapter_id: number;
      completed_missions: number;
      total_missions: number;
      is_completed: boolean;
    }>
  > {
    const { data, error } = await (this.supabase as any).rpc(
      "get_chapter_progress",
      {
        session_uuid: sessionId,
      },
    );

    if (error) {
      console.error("Failed to get chapter progress:", error);
      return [];
    }

    return data || [];
  }

  async getSessionProgressByChapter(
    sessionId: string,
    userId: string,
  ): Promise<Record<number, number>> {
    try {
      loggerInfo("Calculando progresso da sessão por capítulo", {
        sessionId,
        userId,
      });

      const session = await this.getSessionById(sessionId, userId);
      if (!session) {
        throw createError({
          statusCode: 404,
          statusMessage: "Session not found",
        });
      }

      const { data: chapters } = await this.supabase
        .from("chapters")
        .select("id, order_number")
        .order("order_number");

      if (!chapters) {
        return {};
      }

      const chapterProgress: Record<number, number> = {};

      for (const chapter of chapters) {
        const chapterOrder = (chapter as any).order_number;

        const { data: missions } = await this.supabase
          .from("missions")
          .select("id")
          .eq("chapter_id", (chapter as any).id);

        if (!missions || missions.length === 0) {
          chapterProgress[chapterOrder] = 0;
          continue;
        }

        const missionIds = missions.map((m: any) => m.id);

        const { data: totalQuestions } = await this.supabase
          .from("questions")
          .select("id")
          .in("mission_id", missionIds);

        const totalCount = totalQuestions?.length || 0;

        if (totalCount === 0) {
          chapterProgress[chapterOrder] = 0;
          continue;
        }

        const { data: answeredQuestions } = await this.supabase
          .from("session_answers")
          .select("id")
          .eq("session_id", sessionId)
          .in("mission_id", missionIds);

        const answeredCount = answeredQuestions?.length || 0;

        chapterProgress[chapterOrder] = Math.round(
          (answeredCount / totalCount) * 100,
        );
      }

      loggerInfo("Progresso da sessão por capítulo calculado", {
        sessionId,
        userId,
        chaptersCount: chapters.length,
        progressData: chapterProgress,
      });

      return chapterProgress;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError(
        "Erro inesperado ao calcular progresso da sessão por capítulo",
        {
          sessionId,
          userId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      );

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }
}
