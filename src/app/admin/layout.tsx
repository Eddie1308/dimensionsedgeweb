import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin · Dimensions Edge",
  robots: { index: false, follow: false },
};

// Bare html/body for the admin area — the AdminShell wrapper lives in
// admin/(authed)/layout.tsx so the login page can opt out.
// The admin UI is English-only by design.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={cn(inter.variable)}>
      <body className="min-h-screen bg-[var(--color-surface-muted)] antialiased">
        {children}
      </body>
    </html>
  );
}
