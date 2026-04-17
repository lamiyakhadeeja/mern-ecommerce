import nodemailer from "nodemailer";

/**
 * Sends email via SMTP if configured; otherwise logs body (dev-friendly).
 */
export async function sendMail({ to, subject, text, html }) {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim() || user || "noreply@localhost";

  if (!host || !user) {
    console.warn(`[mail] SMTP not configured — OTP for ${to}\nSubject: ${subject}\n${text}\n`);
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br/>"),
  });
  return { sent: true };
}
