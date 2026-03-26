import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your password – Buurtauna Löyly',
    text: `Hi,

You requested a password reset for your Buurtsauna Löyly account.

Click the link below to set a new password. This link is valid for 1 hour.

${resetUrl}

If you did not request this, you can ignore this email. Your password will not change.

– Buurtsauna Löyly`,
  });
}
