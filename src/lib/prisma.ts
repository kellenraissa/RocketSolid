import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import { env } from "@/env";

let prismaInstance: PrismaClient | null = null;
let currentDatabaseUrl: string | null = null;

function getSchemaFromUrl(databaseUrl: string): string | null {
  try {
    const url = new URL(databaseUrl);
    return url.searchParams.get("schema");
  } catch {
    return null;
  }
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL!;
  
  // Se a URL mudou ou não há instância, cria uma nova
  if (!prismaInstance || currentDatabaseUrl !== databaseUrl) {
    // Desconecta a instância anterior se existir
    if (prismaInstance) {
      prismaInstance.$disconnect().catch(() => {});
    }
    
    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "dev" ? ["query"] : [],
    });
    
    currentDatabaseUrl = databaseUrl;
  }
  
  return prismaInstance;
}

// Função para forçar reinicialização (útil para testes)
export function resetPrismaClient() {
  if (prismaInstance) {
    prismaInstance.$disconnect().catch(() => {});
    prismaInstance = null;
    currentDatabaseUrl = null;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = createPrismaClient();
    const value = client[prop as keyof PrismaClient];
    
    // Se for uma função, bind para o contexto correto
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    // Retorna propriedades diretamente (incluindo modelos como user, gym, etc)
    return value;
  },
  has(_target, prop) {
    const client = createPrismaClient();
    return prop in client;
  },
  ownKeys(_target) {
    const client = createPrismaClient();
    return Reflect.ownKeys(client);
  },
});
