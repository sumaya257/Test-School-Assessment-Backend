import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Test_School" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `<p>Please verify your email by clicking <a href="${url}">here</a></p>`,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: `"Test_School" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html: `<p>Reset your password by clicking <a href="${url}">here</a></p>`,
  });
}
