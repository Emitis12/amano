Deno.serve(() => {
  return new Response(
    JSON.stringify({ ok: true, message: "Deployment diagnostic passed" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
