import {
  FolderOpen,
  Handshake,
  Building2,
  Mail,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth/server";

const cards = [
  {
    href: "/admin/projects",
    title: "Projects",
    description: "Manage portfolio entries, images, and visibility.",
    Icon: FolderOpen,
  },
  {
    href: "/admin/partners",
    title: "Partners",
    description: "Vendor and OEM partnerships.",
    Icon: Handshake,
  },
  {
    href: "/admin/clients",
    title: "Clients",
    description: "Logos shown on the public clients wall.",
    Icon: Building2,
  },
  {
    href: "/admin/messages",
    title: "Messages",
    description: "Submissions from the public contact form.",
    Icon: Mail,
  },
  {
    href: "/admin/settings",
    title: "Site settings",
    description: "Logo, hero background, contact info, and brand details.",
    Icon: Settings,
  },
];

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-brand-950)]">
          Welcome back{session?.email ? `, ${session.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Manage projects, partners, clients, and site-wide content from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-[var(--color-brand-950)]">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] group-hover:text-[var(--color-brand-700)]">
              Manage
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
