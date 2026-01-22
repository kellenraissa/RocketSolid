import { FetchUserCheckInsUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchUserCheckInsHistoryUseCase() {
  const repository = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInsUseCase(repository);

  return useCase;
}
