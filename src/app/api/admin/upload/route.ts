import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/server";
import { processAndStoreImage } from "@/lib/upload/processImage";

// Multipart upload endpoint. Admin-guarded, processes image through Sharp,
// saves under /public/uploads/<yyyy>/<mm>/<random>.webp, returns the URL.
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await processAndStoreImage(buffer, file.type || "image/jpeg");
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export const runtime = "nodejs";
// Sharp is a Node-only native module; cannot run in Edge.
