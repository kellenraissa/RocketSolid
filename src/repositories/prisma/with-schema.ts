import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getSchemaFromUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL not set");

  const url = new URL(databaseUrl);
  const schema = url.searchParams.get("schema");

  if (process.env.NODE_ENV === "test" && !schema) {
    throw new Error("E2E is missing ?schema= in DATABASE_URL");
  }

  return schema ?? "public";
}

import { Prisma } from "@prisma/client";

export async function withSchema<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  const schema = getSchemaFromUrl();

  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${schema}"`);
    return fn(tx);
  });
}
