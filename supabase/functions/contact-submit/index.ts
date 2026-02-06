import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://go123logistics.com",
  "https://www.go123logistics.com",
]);

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://go123logistics.com";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
  });
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return json(req, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return json(req, 500, {
        ok: false,
        error: "Server misconfigured (missing env vars)",
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => null);
    if (!body) return json(req, 400, { ok: false, error: "Invalid JSON body" });

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    const page_url = body.page_url ? String(body.page_url).trim() : null;
    const user_agent = body.user_agent ? String(body.user_agent).trim() : null;

    // Validation
    if (!name) return json(req, 400, { ok: false, error: "Name is required" });
    if (phone.length < 6)
      return json(req, 400, { ok: false, error: "Phone is required" });
    if (!isEmail(email))
      return json(req, 400, { ok: false, error: "Invalid email" });
    if (!subject)
      return json(req, 400, { ok: false, error: "Subject is required" });
    if (!message)
      return json(req, 400, { ok: false, error: "Message is required" });

    // Basic spam guard
    if (message.length > 5000)
      return json(req, 400, { ok: false, error: "Message too long" });

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      phone,
      email,
      subject,
      message,
      page_url,
      user_agent,
    });

    if (error) return json(req, 500, { ok: false, error: error.message });

    return json(req, 200, { ok: true });
  } catch {
    return json(req, 500, { ok: false, error: "Unexpected error" });
  }
});
