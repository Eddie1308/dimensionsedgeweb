import { NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/validators/contact";

// Phase 3 stub: validates the submission and returns success without persisting.
// Phase 6 replaces this with a Prisma write to ContactSubmission + (optionally)
// an email notification.
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

    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] received submission:", {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
