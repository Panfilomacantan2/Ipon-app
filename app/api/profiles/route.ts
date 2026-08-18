import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateProfileSchema = z.object({
  has_completed_onboarding: z.boolean().optional(),
});

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("GET /api/profiles - database error:", error.message);
    return Response.json({ error: "Failed to load profile" }, { status: 500 });
  }

  if (!data) {
    // Row genuinely doesn't exist yet - e.g. the signup insert hasn't
    // run for this user. Distinct from a DB error, so the client can
    // tell "not created yet" apart from "something broke".
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Nothing to update - avoid sending an empty PATCH to Postgres.
  if (Object.keys(parsed.data).length === 0) {
    return Response.json({ error: "No fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("PATCH /api/profiles - database error:", error.message);
    return Response.json({ error: "Failed to update profile" }, { status: 500 });
  }

  if (!data) {
    // .single() would throw here (PGRST116) whenever RLS or a missing
    // row means zero rows come back from the update. .maybeSingle()
    // lets us return a clear 404 instead of an opaque crash - this was
    // very likely the source of the empty/invalid response you were
    // seeing during onboarding.
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json({ data });
}