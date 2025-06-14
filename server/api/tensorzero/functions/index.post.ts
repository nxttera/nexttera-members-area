import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import type { TensorZeroFunction } from "~/shared/types/tensorzero";

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  const body = await readBody(event);

  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !userProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "User profile not found",
    });
  }

  if (userProfile.parent_id !== null) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only master accounts can create TensorZero functions",
    });
  }

  const functionData = {
    user_id: userProfile.id,
    name: body.name,
    type: body.type,
    description: body.description,
    is_active: body.is_active ?? true,
  };

  const { data: newFunction, error } = await supabase
    .from("tensorzero_functions")
    .insert([functionData])
    .select()
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return newFunction;
});
