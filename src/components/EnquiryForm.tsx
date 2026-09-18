import { useState } from "react";

type Props = {
  email: string;
};

export default function EnquiryForm({ email }: Props) {
  const [message, setMessage] = useState("");

  function submit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const company = String(form.get("company") ?? "").trim();
    const origin = String(form.get("interest") ?? "").trim();
    const notes = String(form.get("message") ?? "").trim();

    if (!name || !notes) {
      setMessage("Please add your name and enquiry before continuing.");
      return;
    }

    const subject = encodeURIComponent(`Coffee enquiry from ${company || name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Company: ${company || "Not provided"}`, `Interest: ${origin || "General enquiry"}`, "", notes].join("\n"),
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setMessage("Your email application should open with the enquiry prepared.");
  }

  return (
    <form className="enquiry-form" onSubmit={submit} noValidate>
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
        <span>Coffee interest</span>
        <select name="interest" defaultValue="">
          <option value="">Choose an option</option>
          <option>Specialty coffee</option>
          <option>Commercial coffee</option>
          <option>Certified coffee</option>
          <option>Sample request</option>
        </select>
      </label>
      <label>
        <span>Your enquiry *</span>
        <textarea name="message" rows={6} required />
      </label>
      <button className="button button--light" type="submit">Prepare email enquiry</button>
      <p className="form-note" aria-live="polite">
        {message || "GitHub Pages cannot send messages directly. This prepares an email to Sibu Trading PLC."}
      </p>
    </form>
  );
}
