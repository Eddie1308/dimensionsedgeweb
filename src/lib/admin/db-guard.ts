// Wrapper that swallows Prisma errors so admin pages render a friendly notice
// instead of an unhandled exception when MySQL isn't provisioned yet.
//
// Returns a discriminated-union result with an `ok` flag — TypeScript narrows
// the result correctly when destructured with rename (T18047 issue avoided).

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function withAdminDb<T>(fn: () => Promise<T>): Promise<DbResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Unknown database error";
    return { ok: false, error };
  }
}
