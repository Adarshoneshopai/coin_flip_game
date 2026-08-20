import nodemailer from "nodemailer";

let cachedTransporter;

const hasSmtpConfig = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getTransporter = () => {
  if (!hasSmtpConfig()) return null;
  if (!cachedTransporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return cachedTransporter;
};

// Sends the password reset email. If no SMTP_* env vars are configured
// (e.g. local dev), logs the reset link to the console instead of failing,
// so the flow stays testable without real email credentials.
export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      `\n[dev] SMTP not configured — password reset link for ${toEmail}:\n${resetLink}\n`
    );
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: "Reset your Heads or Tails password",
    text: `We received a request to reset your password.\n\nThis link expires in 15 minutes and can only be used once:\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email — your password won't change.`,
    html: `
      <p>We received a request to reset your password.</p>
      <p>This link expires in <strong>15 minutes</strong> and can only be used once:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
    `,
  });
};
