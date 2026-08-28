"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { GoalActionState } from "../types/action.type";

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
      data: null,
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
      data: null,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: null,
    data,
  };
}

export async function contributeGoal(
  _previousState: GoalActionState,
  formData: FormData,
): Promise<GoalActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized", data: null };
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

  return {
    success: true,
    error: null,
    message: "Contribution added successfully.",
  };
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
      data: null,
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
      data: null,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: "",
  };
}

export async function addContributionGoal(
  _previousState: GoalActionState,
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
      data: null,
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
    console.error("Failed to add contribution:", error);

    return {
      success: false,
      error: error.message,
      data: null,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: "",
    message: "Contribution added successfully.",
    data: null,
  };
}


export async function updateGoal(
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
      data: null,
    };
  }

  const goalId = formData.get("goal_id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const targetAmount = Number(formData.get("target_amount"));
  const targetDate = formData.get("target_date") as string;
  const status = formData.get("status") as string;

  console.log(formData)

  const { data, error } = await supabase
    .from("goals")
    .update({
      name,
      description,
      target_amount: targetAmount,
      target_date: targetDate,
      status
    })
    .eq("id", goalId)
    .select()
    .single();

  if (error) {
    console.error("Update goal error:", error);

    return {
      success: false,
      error: error.message,
      data: null,
    };
  }

  revalidatePath("/(dashboard)/goals");

  return {
    success: true,
    error: null,
    data,
  };
}
