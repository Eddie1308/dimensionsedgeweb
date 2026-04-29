import { Database, AlertTriangle } from "lucide-react";

// Rendered on admin pages when Prisma can't reach MySQL.
// Phase 6 ships with this fallback because aaPanel + MySQL provisioning is a
// post-handoff step. Once DATABASE_URL points at a real database, the page
// will render normally and this notice never appears.
export function DbNotice({ error }: { error: string }) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-700">
          <Database className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-amber-900">
            Database not reachable
          </h2>
          <p className="mt-1 text-sm text-amber-800">
            The admin area needs MySQL to be live. Once the database is
            provisioned and <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> is set in
            <code className="rounded bg-amber-100 px-1">.env</code>, run:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-amber-200 bg-white p-3 text-xs text-amber-900">
            <code>{"npx prisma migrate dev --name init\nnpm run prisma:seed"}</code>
          </pre>
          <details className="mt-4 text-xs text-amber-800">
            <summary className="cursor-pointer font-semibold">
              <AlertTriangle className="me-1 inline h-3 w-3" /> Technical detail
            </summary>
            <p className="mt-1.5 break-all font-mono">{error}</p>
          </details>
        </div>
      </div>
    </div>
  );
}
