import { createClient } from "@/lib/supabase/server";

export default async function ProfilesPage() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="mb-4 text-2xl font-bold">Profiles</h1>
        <p className="text-red-600">Failed to fetch profiles: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Profiles</h1>

      {profiles && profiles.length > 0 ? (
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(profiles, null, 2)}
        </pre>
      ) : (
        <p className="text-muted-foreground">No rows found in the profiles table.</p>
      )}
    </main>
  );
}
