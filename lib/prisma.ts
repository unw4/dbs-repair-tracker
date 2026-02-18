import path from "path";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function makePrisma(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  // better-sqlite3 expects a file path, not a file: URI
  const url = rawUrl.startsWith("file:")
    ? path.resolve(process.cwd(), rawUrl.slice("file:".length))
    : rawUrl;
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
