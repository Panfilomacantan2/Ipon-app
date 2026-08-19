"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { CategoryActionState } from "../types/action.type";


export async function createCategory(
  _previousState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
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

  const name = formData.get("name")?.toString().trim();
  const type = formData.get("type")?.toString();
  const icon = formData.get("icon")?.toString();
  const color = formData.get("color")?.toString();

  if (!name) {
    return {
      success: false,
      error: "Category name is required.",
    };
  }

  if (!type) {
    return {
      success: false,
      error: "Category type is required.",
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: user.id,
      name,
      type,
      icon: icon || null,
      color: color || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Create category error:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/categories");

  return {
    success: true,
    error: "",
    data,
  };
}
