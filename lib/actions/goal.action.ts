"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function createGoal(
  _previousState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      target_amount: Number(formData.get("target_amount")),
      target_date: formData.get("target_date") as string,
    })
    .select()
    .single();

  if (error) {
    console.error("Create goal error:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: "",
    data,
  };
}
