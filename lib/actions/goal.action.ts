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

export async function contributeGoal(
  _previousState: { success: boolean; error?: string; message?: string },
  formData: FormData,
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const goalId = formData.get("goal_id") as string;
  const amount = Number(formData.get("amount"));

  const { error } = await supabase.from("goal_contributions").insert({
    goal_id: goalId,
    user_id: user.id,
    amount,
    note: formData.get("note") as string,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/(dashboard)/goals");

  return { success: true, message: "Contribution added successfully." };
}

export async function deleteGoal(goalId: string) {
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

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete goal:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: "",
  };
}

export async function addContributionGoal(
  _previousState: { success: boolean; error?: string; message?: string },
  formData: FormData,
) {
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

  const goalId = formData.get("goal_id") as string;
  const amount = Number(formData.get("amount"));
  const contributionDate = formData.get("contribution_date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase.from("goal_contributions").insert({
    goal_id: goalId,
    amount,
    contribution_date: contributionDate,
    note,
  });

  if (error) {
    console.error("Failed to delete goal:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: "",
  };
}
