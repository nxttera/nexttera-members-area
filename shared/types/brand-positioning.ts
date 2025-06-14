export type SessionStatus = "draft" | "in_progress" | "completed";
export type QuestionType = "text" | "textarea" | "select" | "multi_select";

export type Chapter = {
  id: number;
  title: string;
  description: string;
  icon: string;
  order_number: number;
  total_missions: number;
  reward_title: string;
  created_at: string;
};

export type Mission = {
  id: number;
  chapter_id: number;
  title: string;
  description: string;
  order_number: number;
  total_questions: number;
  created_at: string;
};

export type Question = {
  id: number;
  mission_id: number;
  text: string;
  description?: string;
  question_type: QuestionType;
  options?: string[];
  is_required: boolean;
  order_number: number;
  created_at: string;
};

export type BrandPositioningSession = {
  id: string;
  user_id: string;
  title: string;
  status: SessionStatus;
  current_chapter?: number;
  current_mission?: number;
  total_progress: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

export type SessionAnswer = {
  id: string;
  session_id: string;
  question_id: number;
  answer: string;
  answered_at: string;
};

export type SessionProgress = {
  id: string;
  session_id: string;
  chapter_id: number;
  mission_id: number;
  is_chapter_completed: boolean;
  is_mission_completed: boolean;
  completed_at?: string;
  created_at: string;
};

export type CreateSessionRequest = {
  title: string;
};

export type SaveAnswersRequest = {
  answers: Record<number, string>;
};

export type UpdateProgressRequest = {
  chapterId: number;
  missionId: number;
};

export type BrandPositioningResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};

export type MissionWithQuestions = Mission & {
  questions: Question[];
};

export type ChapterWithMissions = Chapter & {
  missions: Mission[];
};

export type SessionWithProgress = BrandPositioningSession & {
  answered_questions_count: number;
  total_questions_count: number;
  chapter_progress: Array<{
    chapter_id: number;
    completed_missions: number;
    total_missions: number;
    is_completed: boolean;
  }>;
};
