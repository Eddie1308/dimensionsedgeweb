// Top-level 404 — rendered when middleware / next-intl can't resolve a locale.
// Locale-aware 404 lives in app/[locale]/not-found.tsx (added in Phase 3).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
          <p className="text-sm text-neutral-600">
            <a href="/en" className="underline">
              Go home
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
