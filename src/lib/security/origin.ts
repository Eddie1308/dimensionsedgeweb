// Same-origin check for state-changing admin requests.
//
// SameSite=lax cookies block most cross-site POSTs but not all (e.g. top-level
// form submissions). Verifying Origin/Referer matches our own host closes that
// gap. This is defense-in-depth on top of session auth — if both fail to
// match, we reject before doing any work.

const PROD_HOSTS = [
  "dimensionsedgeest.com",
  "www.dimensionsedgeest.com",
];

function getAllowedHosts(): string[] {
  const hosts = new Set(PROD_HOSTS);
  // Allow whatever NEXT_PUBLIC_SITE_URL points at (handles staging domains).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).host);
    } catch {
      /* ignore */
    }
  }
  // Localhost variants for dev.
  if (process.env.NODE_ENV !== "production") {
    hosts.add("localhost:3000");
    hosts.add("localhost:3001");
    hosts.add("127.0.0.1:3000");
    hosts.add("127.0.0.1:3001");
  }
  return [...hosts];
}

function hostFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

export function isSameOrigin(request: Request): boolean {
  const allowed = getAllowedHosts();

  const originHost = hostFromUrl(request.headers.get("origin"));
  if (originHost) return allowed.includes(originHost);

  // Some browsers omit Origin on same-origin requests (rare, but possible
  // with file:// or embedded contexts). Fall back to Referer.
  const refererHost = hostFromUrl(request.headers.get("referer"));
  if (refererHost) return allowed.includes(refererHost);

  // No Origin and no Referer: reject. Real browsers always send at least one
  // for credentialed cross-site POSTs, so missing both is suspicious.
  return false;
}
