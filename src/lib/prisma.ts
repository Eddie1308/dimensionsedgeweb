import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Lazy initialization. The client is constructed on first access — not on
// module load — which keeps `next build` quiet when DATABASE_URL points at a
// non-running database (e.g. during static generation for routes that don't
// actually call Prisma at request time).

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient() {
  const url = new URL(process.env.DATABASE_URL!);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 5,
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createClient();
  // Cache in all environments — critical in production to avoid pool exhaustion
  globalForPrisma.prisma = client;
  return client;
}

// Proxy so importing `prisma` doesn't construct the client. The first method
// call does. PrismaClient method names (`project`, `partner`, etc.) are looked
// up on demand.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
}) as PrismaClient;
