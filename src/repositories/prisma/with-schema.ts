import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function getSchemaFromUrl(): string | null {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;
  
  try {
    const url = new URL(databaseUrl);
    return url.searchParams.get("schema");
  } catch {
    return null;
  }
}

/**
 * Executa uma função dentro de uma transação com o schema correto configurado
 */
export async function withSchema<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  const schema = getSchemaFromUrl();
  
  return await prisma.$transaction(async (tx) => {
    if (schema) {
      await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${schema}"`);
    }
    
    return await fn(tx);
  });
}
