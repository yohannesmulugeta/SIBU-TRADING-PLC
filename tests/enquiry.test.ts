import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleEnquiry } from "../worker/index";

const send = vi.fn();
const limit = vi.fn();
const verify = vi.fn();
const env: Env = {
  ENQUIRY_EMAIL: { send }, ENQUIRY_LIMITER: { limit }, ASSETS: { fetch: vi.fn(), connect: vi.fn() },
  CONTACT_EMAIL: "Salimhassen40@gmail.com", TURNSTILE_SECRET_KEY: "test-secret",
};

function request(overrides: Partial<Record<string, string>> = {}, origin = "https://sibutradingplc.com") {
  const body = new URLSearchParams({ name: "Test buyer", email: "buyer@example.com", company: "Test company", interest: "Sample request", message: "Please share coffee availability.", "cf-turnstile-response": "test-token" });
  for (const [key, value] of Object.entries(overrides)) if (value !== undefined) body.set(key, value);
  return new Request("https://sibutradingplc.com/api/contact", { method: "POST", headers: { origin, "CF-Connecting-IP": "192.0.2.1" }, body });
}

beforeEach(() => {
  vi.clearAllMocks();
  limit.mockResolvedValue({ success: true });
  send.mockResolvedValue({ messageId: "test-message" });
  verify.mockResolvedValue(Response.json({ success: true, hostname: "sibutradingplc.com", action: "enquiry" }));
  vi.stubGlobal("fetch", verify);
});
afterEach(() => vi.unstubAllGlobals());

describe("protected enquiry delivery", () => {
  it("sends only to the configured inbox with the buyer as Reply-To", async () => {
    const response = await handleEnquiry(request({ message: "Please review <b>coffee</b>" }), env);
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "Salimhassen40@gmail.com", replyTo: "buyer@example.com", from: { email: "enquiries@sibutradingplc.com", name: "Sibu website enquiries" } }));
    expect(send.mock.calls[0][0].html).toContain("&lt;b&gt;coffee&lt;/b&gt;");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("rejects cross-site submissions before processing or sending", async () => {
    expect((await handleEnquiry(request({}, "https://other.example"), env)).status).toBe(403);
    expect(verify).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
  it.each([{ email: "buyer@example.com\r\nBcc: other@example.com" }, { message: "x".repeat(5001) }, { _gotcha: "spam" }, { "cf-turnstile-response": "" }, { name: "" }])("rejects malformed or automated input %o", async (fields) => {
    expect((await handleEnquiry(request(fields), env)).status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });
  it.each([{ success: false }, { success: true, hostname: "other.example", action: "enquiry" }, { success: true, hostname: "sibutradingplc.com", action: "login" }])("rejects invalid verification %o", async (result) => {
    verify.mockResolvedValue(Response.json(result));
    expect((await handleEnquiry(request(), env)).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });
  it("does not report success when the email provider refuses delivery", async () => {
    send.mockRejectedValue(new Error("destination not verified"));
    const response = await handleEnquiry(request(), env);
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ success: false });
  });
  it("enforces the request limit without sending an email", async () => {
    limit.mockResolvedValue({ success: false });
    const response = await handleEnquiry(request(), env);
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects oversized bodies and unsupported HTTP methods", async () => {
    expect((await handleEnquiry(request({ message: "x".repeat(17000) }), env)).status).toBe(413);
    expect((await handleEnquiry(new Request("https://sibutradingplc.com/api/contact"), env)).status).toBe(405);
    expect(send).not.toHaveBeenCalled();
  });
});
