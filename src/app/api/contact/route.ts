import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSubmissionSchema } from "@/lib/validators/contact";

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

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("[contact] error:", e);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
