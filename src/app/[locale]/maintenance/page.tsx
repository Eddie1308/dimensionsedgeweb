import { getSiteSettings } from "@/lib/content/siteSettings";
import { Logo } from "@/components/layout/Logo";

export default async function MaintenancePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-brand-950)] px-6 text-center">
      <div className="mb-8">
        <Logo logoUrl={settings.logoUrl} siteName={settings.siteNameEn} />
      </div>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Site under maintenance
      </h1>
      <p className="mt-4 max-w-md text-lg text-[var(--color-brand-300)]">
        We are currently performing scheduled maintenance. Thank you for your patience — we will be back shortly.
      </p>
      <p className="mt-8 text-sm text-[var(--color-brand-500)]">
        For urgent enquiries:{" "}
        <a href={`mailto:${settings.email}`} className="text-[var(--color-accent-400)] hover:underline">
          {settings.email}
        </a>
      </p>
    </div>
  );
}
