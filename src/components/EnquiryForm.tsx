import { useEffect, useRef, useState, type SubmitEvent } from "react";

type Turnstile = {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(id: string): void;
  remove(id: string): void;
};
declare global { interface Window { turnstile?: Turnstile } }

export default function EnquiryForm({ email, sitekey }: { email: string; sitekey: string }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [token, setToken] = useState("");
  const challenge = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    const render = () => {
      if (!challenge.current || !window.turnstile || widget.current !== undefined) return;
      widget.current = window.turnstile.render(challenge.current, {
        sitekey, action: "enquiry", theme: "light", size: "flexible",
        callback: (value: string) => setToken(value),
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setMessage(`Verification is unavailable. You can email ${email} directly.`); },
      });
    };
    let script = document.querySelector<HTMLScriptElement>("script[data-sibu-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.sibuTurnstile = "true";
      document.head.append(script);
    }
    script.addEventListener("load", render);
    render();
    return () => {
      script.removeEventListener("load", render);
      if (widget.current !== undefined) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [email, sitekey]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!token) { setMessage("Please complete the verification below before sending."); return; }
    setStatus("sending");
    setMessage("Sending your enquiry…");
    try {
      const data = new FormData(form);
      data.set("cf-turnstile-response", token);
      const response = await fetch("/api/contact", {
        method: "POST", body: data, headers: { Accept: "application/json" }, signal: AbortSignal.timeout(25_000),
      });
      const result = await response.json() as { success?: boolean; message?: string };
      if (!response.ok || result.success !== true) throw new Error(result.message || "Your enquiry could not be sent.");
      form.reset();
      setStatus("success");
      setMessage("Thank you. Your enquiry has been sent to Sibu Trading PLC.");
    } catch (error) {
      setStatus("error");
      setMessage(`${error instanceof Error ? error.message : "Your enquiry could not be sent."} Your details are still here. You can also email us directly below.`);
    } finally {
      setToken("");
      if (widget.current !== undefined) window.turnstile?.reset(widget.current);
    }
  }

  return (
    <form className="enquiry-form" action="/api/contact" method="post" onSubmit={submit}>
      <div className="form-grid">
        <label><span>Your name *</span><input name="name" autoComplete="name" maxLength={120} required /></label>
        <label><span>Company</span><input name="company" autoComplete="organization" maxLength={160} /></label>
      </div>
      <label><span>Business email *</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>
        <span>Coffee interest</span>
        <select name="interest" defaultValue="">
          <option value="">Choose an option</option><option>Specialty coffee</option><option>Commercial coffee</option>
          <option>Certified coffee</option><option>Sample request</option>
        </select>
      </label>
      <div className="form-grid">
        <label><span>Estimated volume</span><input name="volume" placeholder="For example: 1 container" maxLength={100} /></label>
        <label><span>Destination market</span><input name="destination" autoComplete="country-name" maxLength={100} /></label>
      </div>
      <label><span>Your enquiry *</span><textarea name="message" rows={6} maxLength={5000} required /></label>
      <label className="form-honeypot" aria-hidden="true"><span>Leave this field empty</span><input name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
      <div ref={challenge} className="enquiry-verification" aria-label="Enquiry spam protection" />
      <button className="button button--light" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry"}</button>
      <p className="form-note" role="status" aria-live="polite" data-status={status}>{message || "Share your requirements and the Sibu team will respond with availability and next steps."}</p>
      <p className="form-note">Prefer email? <a href={`mailto:${email}`}>{email}</a></p>
      <noscript><p>Please enable JavaScript to use the form, or contact us directly by email.</p></noscript>
    </form>
  );
}
