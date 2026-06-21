import nodemailer from "nodemailer";

function getSmtpConfig() {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_PASS?.trim();

  if (gmailUser && gmailPass) {
    return {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      user: gmailUser,
      pass: gmailPass.replace(/\s+/g, ""),
      from: process.env.SMTP_FROM?.trim() || `TechStore <${gmailUser}>`,
    };
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from: process.env.SMTP_FROM?.trim() || user,
  };
}

/**
 * Sends email via SMTP if configured; otherwise logs body (dev-friendly).
 */
export async function sendMail({ to, subject, text, html }) {
  const cfg = getSmtpConfig();

  if (!cfg) {
    console.warn(`[mail] SMTP not configured — OTP for ${to}\nSubject: ${subject}\n${text}\n`);
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, "<br/>"),
  });
  return { sent: true };
}
