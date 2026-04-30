import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSubmissionSchema } from "@/lib/validators/contact";

async function sendNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
}) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !notifyEmail) return;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = data.subject
    ? `New enquiry: ${data.subject}`
    : `New contact form submission from ${data.name}`;

  const html = `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Name</td><td style="padding:8px">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px"><a href="mailto:${data.email}">${data.email}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Phone</td><td style="padding:8px">${data.phone}</td></tr>` : ""}
      ${data.company ? `<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Company</td><td style="padding:8px">${data.company}</td></tr>` : ""}
      ${data.subject ? `<tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Subject</td><td style="padding:8px">${data.subject}</td></tr>` : ""}
      <tr><td style="padding:8px;font-weight:bold;background:#f5f5f5">Message</td><td style="padding:8px;white-space:pre-wrap">${data.message}</td></tr>
    </table>
    <p style="margin-top:16px;color:#666">Reply directly to this email to respond to the enquiry.</p>
  `;

  await transporter.sendMail({
    from: `"Dimensions Edge Website" <${smtpUser}>`,
    to: notifyEmail,
    replyTo: data.email,
    subject,
    html,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const { name, email, phone, company, subject, message } = parsed.data;

    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject: subject || null,
        message,
      },
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendNotificationEmail({ name, email, phone, company, subject, message }).catch((err) =>
      console.error("[contact] email send failed:", err),
    );

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[contact] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
