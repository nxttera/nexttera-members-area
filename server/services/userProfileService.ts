import type { SupabaseClient } from "@supabase/supabase-js";
import { loggerError, loggerInfo } from "~/shared/utils/logger";

export interface UserProfileUpdateData {
  name?: string;
  company?: string;
  phone?: string;
  onboarding_completed?: boolean;
}

export class UserProfileService {
  constructor(private supabase: SupabaseClient) {}

  async getUserProfile(userId: string) {
    try {
      loggerInfo("Iniciando busca de perfil do usuário", { userId });

      const { data: userProfile, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        loggerError("Erro do Supabase ao buscar perfil do usuário", {
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        throw createError({
          statusCode: error.code === "PGRST116" ? 404 : 500,
          statusMessage: error.code === "PGRST116"
            ? "Perfil não encontrado"
            : `Failed to fetch user profile: ${error.message}`,
        });
      }

      loggerInfo("Perfil do usuário encontrado com sucesso", {
        userId,
        hasName: !!userProfile?.name,
        hasCompany: !!userProfile?.company,
        onboardingCompleted: userProfile?.onboarding_completed,
      });

      return userProfile;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao buscar perfil do usuário", {
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

  async updateUserProfile(userId: string, updateData: UserProfileUpdateData) {
    try {
      loggerInfo("Iniciando atualização de perfil do usuário", {
        userId,
        fieldsToUpdate: Object.keys(updateData),
        hasName: "name" in updateData,
        hasCompany: "company" in updateData,
        hasPhone: "phone" in updateData,
        onboardingUpdate: "onboarding_completed" in updateData,
      });

      const allowedFields = [
        "name",
        "company",
        "phone",
        "onboarding_completed",
      ];
      const sanitizedData: Record<string, any> = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          sanitizedData[key] = value;
        }
      }

      sanitizedData.updated_at = new Date().toISOString();

      loggerInfo("Dados sanitizados para atualização", {
        userId,
        sanitizedFields: Object.keys(sanitizedData),
        originalFields: Object.keys(updateData),
      });

      const { data: updatedProfile, error } = await (this.supabase as any)
        .from("user_profiles")
        .update(sanitizedData)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        loggerError("Erro do Supabase ao atualizar perfil do usuário", {
          userId,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          sanitizedFields: Object.keys(sanitizedData),
        });

        throw createError({
          statusCode: error.code === "PGRST116" ? 404 : 500,
          statusMessage: error.code === "PGRST116"
            ? "Perfil não encontrado"
            : `Failed to update user profile: ${error.message}`,
        });
      }

      loggerInfo("Perfil do usuário atualizado com sucesso", {
        userId,
        updatedFields: Object.keys(sanitizedData),
        profileId: updatedProfile?.id,
      });

      return updatedProfile;
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        throw error;
      }

      loggerError("Erro inesperado ao atualizar perfil do usuário", {
        userId,
        updateData: Object.keys(updateData),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw createError({
        statusCode: 500,
        statusMessage: "Erro interno do servidor",
      });
    }
  }
}
