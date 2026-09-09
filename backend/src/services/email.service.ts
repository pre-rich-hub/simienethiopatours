import { env } from "../config/env.js";
import { logger } from "../config/pino.js";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

// ---------------------------------------------------------------------------
// Transport — SMTP or Resend API
// ---------------------------------------------------------------------------

export async function sendMail(input: SendEmailInput) {
  if (!env.EMAIL_ENABLED) {
    logger.info({ to: input.to, subject: input.subject }, "[email disabled]");
    return;
  }

  if (env.EMAIL_PROVIDER === "resend") {
    await sendWithResend(input);
    return;
  }

  await sendWithSmtp(input);
}

async function sendWithResend(input: SendEmailInput) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.SMTP_FROM,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Resend email failed (${response.status}): ${body}`);
  }
}

async function sendWithSmtp(input: SendEmailInput) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:
      env.SMTP_USER && env.SMTP_PASS
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.html.replace(/<[^>]+>/g, " "),
    replyTo: input.replyTo,
  });
}

export async function sendEmail(input: SendEmailInput) {
  await sendMail(input);
}

// ---------------------------------------------------------------------------
// Domain emails — customize per client
// ---------------------------------------------------------------------------

export async function sendContactAdminEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!env.ADMIN_EMAIL) return;

  await sendEmail({
    to: env.ADMIN_EMAIL,
    replyTo: data.email,
    subject: `New Contact Inquiry - ${data.name}`,
    html: `
      <h1>New Contact Inquiry</h1>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    `,
  });
}

export async function sendBookingAdminEmail(data: {
  bookingId: number;
  fullName: string;
  email: string;
  phone: string;
  tourName: string;
  chosenDate: string;
}) {
  if (!env.ADMIN_EMAIL) return;

  await sendEmail({
    to: env.ADMIN_EMAIL,
    replyTo: data.email,
    subject: `New Booking Inquiry (#${data.bookingId}) - ${data.fullName}`,
    html: `
      <h1>New Booking Inquiry</h1>
      <p><strong>Booking ID:</strong> #${data.bookingId}</p>
      <p><strong>Tour:</strong> ${escapeHtml(data.tourName)}</p>
      <p><strong>Date:</strong> ${escapeHtml(data.chosenDate)}</p>
      <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    `,
  });
}

export async function sendBookingCustomerEmail(data: {
  email: string;
  fullName: string;
  tourName: string;
  bookingId: number;
  chosenDate: string;
}) {
  await sendEmail({
    to: data.email,
    subject: "We received your booking inquiry",
    html: `
      <h1>Booking Request Received</h1>
      <p>Dear ${escapeHtml(data.fullName)},</p>
      <p>Thank you for your interest. We received your booking inquiry for <strong>${escapeHtml(data.tourName)}</strong>.</p>
      <p><strong>Booking ID:</strong> #${data.bookingId}</p>
      <p><strong>Travel Date:</strong> ${escapeHtml(data.chosenDate)}</p>
      <p>Our team will contact you shortly.</p>
    `,
  });
}