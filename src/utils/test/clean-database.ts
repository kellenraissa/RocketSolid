import { withSchema } from "@/repositories/prisma/with-schema";

export async function cleanDatabase() {
  await withSchema(async (tx) => {
    // Limpar todas as tabelas na ordem correta (respeitando foreign keys)
    await tx.checkIn.deleteMany();
    await tx.gym.deleteMany();
    await tx.user.deleteMany();
  });
}
