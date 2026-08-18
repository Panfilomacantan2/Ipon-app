// actions/accounts.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAccount(formData: FormData) {
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

  const { error } = await supabase
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
    .select();


  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/(dashboard)/accounts");

  //     for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }
}
