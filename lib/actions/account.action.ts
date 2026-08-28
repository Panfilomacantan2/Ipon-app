"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AccountActionState } from "@/lib/types/action.type";

export async function createAccount(
  _previousState: AccountActionState,
  formData: FormData,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const currency = formData.get("currency") as string;
  const balance = Number(formData.get("balance")) || 0;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("accounts")
    .insert([
      {
        name,
        type,
        currency,
        initial_balance: balance,
        description,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/accounts");

  return {
    success: true,
    error: "",
    data,
  };
}

export async function deleteAcount(accountId: string) {
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
    .from("accounts")
    .delete()
    .eq("id", accountId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete account:", error);

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/account");

  return {
    success: true,
    error: "",
  };
}

export async function editAccount(_previousState: AccountActionState, formData: FormData) {
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

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const currency = formData.get("currency") as string;
  const initial_balance = Number(formData.get("balance")) || 0;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("accounts")
    .update({
      name,
      type,
      currency,
      initial_balance,
      description,
    })
    .eq("id", formData.get("id"))
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/(dashboard)/accounts");

  return {
    success: true,
    error: "",
    data,
  };
}
