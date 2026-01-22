import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import type { Environment } from "vitest/environments";

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Plase provide a DATABASE_URL env variable");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  url.searchParams.set("options", `-c search_path=${schema}`);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  viteEnvironment: "ssr",
  async setup() {
    // 1 Criar banco de testes
    const schema = randomUUID();
    const databaseUrl = generateDatabaseUrl(schema);

    // Configurar DATABASE_URL ANTES de importar o Prisma Client
    process.env.DATABASE_URL = databaseUrl;
    process.env.NODE_ENV = "test";

    execSync("npx prisma migrate deploy", {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    });

    // Importar e resetar o Prisma Client para usar a nova URL
    const { prisma, resetPrismaClient } = await import("../../src/lib/prisma");
    resetPrismaClient();

    return {
      async teardown() {
        // 2 Apagar banco de testes
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
