const allowedOrigins = new Set(["https://sibutradingplc.com", "https://www.sibutradingplc.com"]);
const allowedInterests = new Set(["", "Specialty coffee", "Commercial coffee", "Certified coffee", "Sample request"]);
const maxBytes = 16_384;

function reply(status: number, message: string, extra: Record<string, string> = {}) {
  return Response.json({ success: status === 200, message }, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      ...extra,
    },
  });
}

async function readForm(request: Request): Promise<FormData> {
  const type = request.headers.get("content-type") || "";
  if (!/^(multipart\/form-data|application\/x-www-form-urlencoded)(;|$)/i.test(type)) {
    throw new Error("content-type");
  }
  if (Number(request.headers.get("content-length")) > maxBytes) throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new Error("size");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new Response(bytes, { headers: { "Content-Type": type } }).formData();
}

export async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return reply(405, "Please use the enquiry form.", { Allow: "POST" });
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) return reply(403, "Please submit your enquiry from the Sibu website.");

  try {
    const limit = await env.ENQUIRY_LIMITER.limit({ key: `contact:${request.headers.get("CF-Connecting-IP") || "unknown"}` });
    if (!limit.success) return reply(429, "Please wait a minute before trying again.", { "Retry-After": "60" });
    let form: FormData;
    try { form = await readForm(request); }
    catch (error) {
      return reply(error instanceof Error && error.message === "size" ? 413 : 400, "Please check your enquiry and try again.");
    }
    if (form.get("_gotcha")) return reply(400, "Please check your enquiry and try again.");
    const fields: Record<string, string> = {};
    for (const [key, maximum, required] of [
      ["name", 120, true], ["email", 254, true], ["company", 160, false],
      ["interest", 50, false], ["volume", 100, false], ["destination", 100, false],
      ["message", 5000, true], ["cf-turnstile-response", 2048, true],
    ] as const) {
      const value = form.get(key);
      if (typeof value !== "string" && value !== null) return reply(400, "Attachments are not supported.");
      fields[key] = (value || "").trim();
      if ((required && !fields[key]) || fields[key].length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(fields[key])) {
        return reply(400, "Please complete the required fields within their length limits.");
      }
      if (key !== "message" && /[\r\n]/.test(fields[key])) return reply(400, "Please check your contact details.");
    }
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.email) || !allowedInterests.has(fields.interest)) {
      return reply(400, "Please check your email address and coffee interest.");
    }
    if (!env.TURNSTILE_SECRET_KEY) return reply(503, `Please email ${env.CONTACT_EMAIL} directly.`);
    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: fields["cf-turnstile-response"], remoteip: request.headers.get("CF-Connecting-IP") || undefined }),
      signal: AbortSignal.timeout(10_000),
    });
    const result = await verification.json() as { success?: boolean; hostname?: string; action?: string };
    if (!verification.ok || !result.success || result.hostname !== "sibutradingplc.com" || result.action !== "enquiry") {
      return reply(403, "Please refresh the verification and try again.");
    }
    const text = [
      "New Sibu Trading PLC website enquiry", "",
      `Name: ${fields.name}`, `Email: ${fields.email}`, `Company: ${fields.company || "Not provided"}`,
      `Interest: ${fields.interest || "General enquiry"}`, `Estimated volume: ${fields.volume || "Not provided"}`,
      `Destination: ${fields.destination || "Not provided"}`, "", fields.message,
    ].join("\n");
    const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
    await env.ENQUIRY_EMAIL.send({
      from: { email: "enquiries@sibutradingplc.com", name: "Sibu website enquiries" },
      to: env.CONTACT_EMAIL,
      replyTo: fields.email,
      subject: "New coffee enquiry — Sibu Trading PLC",
      text,
      html: `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escape(text)}</pre>`,
    });
    return reply(200, "Thank you. Your enquiry has been sent to Sibu Trading PLC.");
  } catch {
    // No enquiry contents, contact information or credentials are written to logs.
    console.error(JSON.stringify({ event: "enquiry_delivery_unavailable" }));
    return reply(503, `We could not send your enquiry. Please email ${env.CONTACT_EMAIL} directly.`);
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") return handleEnquiry(request, env);
    if (url.pathname.startsWith("/api/")) return reply(404, "This service was not found.");
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
