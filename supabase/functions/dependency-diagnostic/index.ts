import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(() => {
  return new Response(
    JSON.stringify({
      ok: true,
      dependency: typeof createClient === "function"
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
