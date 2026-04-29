import type { Metadata } from "next";
import { Logo } from "@/components/layout/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-muted)] px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--color-brand-950)]">
            Sign in to admin
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Authorized personnel only.
          </p>
          <LoginForm redirectTo={from ?? "/admin"} />
        </div>
        <p className="mt-6 text-center text-xs text-[var(--color-ink-subtle)]">
          Forgot your credentials? Contact your system administrator.
        </p>
      </div>
    </main>
  );
}
