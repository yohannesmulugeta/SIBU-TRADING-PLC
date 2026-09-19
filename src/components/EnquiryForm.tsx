import { useState, type SubmitEvent } from "react";

type Props = {
  email: string;
  endpoint?: string;
};

type FormStatus = "idle" | "sending" | "success" | "error";

export default function EnquiryForm({ email, endpoint }: Props) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }

    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    const buyerEmail = String(form.get("email") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const origin = String(form.get("interest") ?? "").trim();
    const volume = String(form.get("volume") ?? "").trim();
    const destination = String(form.get("destination") ?? "").trim();
    const notes = String(form.get("message") ?? "").trim();

    if (endpoint) {
      setStatus("sending");
      setMessage("Sending your enquiry…");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: form,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Submission failed");
        formElement.reset();
        setStatus("success");
        setMessage("Thank you. Your enquiry has been sent to Sibu Trading PLC.");
      } catch {
        setStatus("error");
        setMessage(`The form could not be sent. Please email ${email} directly.`);
      }
      return;
    }

    const subject = encodeURIComponent(`Coffee enquiry from ${company || name}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${buyerEmail}`,
        `Company: ${company || "Not provided"}`,
        `Interest: ${origin || "General enquiry"}`,
        `Estimated volume: ${volume || "Not provided"}`,
        `Destination: ${destination || "Not provided"}`,
        "",
        notes,
      ].join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("success");
    setMessage("Your email application should open with the enquiry prepared.");
  }

  return (
    <form
      className="enquiry-form"
      action={endpoint || `mailto:${email}`}
      method="post"
      encType={endpoint ? "multipart/form-data" : "text/plain"}
      onSubmit={submit}
    >
      <div className="form-grid">
        <label>
          <span>Your name *</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <label>
        <span>Business email *</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>Coffee interest</span>
        <select name="interest" defaultValue="">
          <option value="">Choose an option</option>
          <option>Specialty coffee</option>
          <option>Commercial coffee</option>
          <option>Certified coffee</option>
          <option>Sample request</option>
        </select>
      </label>
      <div className="form-grid">
        <label>
          <span>Estimated volume</span>
          <input name="volume" placeholder="For example: 1 container" />
        </label>
        <label>
          <span>Destination market</span>
          <input name="destination" autoComplete="country-name" />
        </label>
      </div>
      <label>
        <span>Your enquiry *</span>
        <textarea name="message" rows={6} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Leave this field empty</span>
        <input name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button--light" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : endpoint ? "Send enquiry" : "Prepare email enquiry"}
      </button>
      <p className="form-note" aria-live="polite" data-status={status}>
        {message || (endpoint
          ? "Share your requirements and the Sibu team will respond with availability and next steps."
          : `This prepares an email to ${email}.`)}
      </p>
    </form>
  );
}
