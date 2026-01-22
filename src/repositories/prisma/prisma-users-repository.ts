import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { withSchema } from "./with-schema";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    return await withSchema(async (tx) => {
      return await tx.user.findUnique({
        where: {
          id,
        },
      });
    });
  }

  async findByEmail(email: string) {
    return await withSchema(async (tx) => {
      return await tx.user.findUnique({
        where: {
          email,
        },
      });
    });
  }
  
  async create(data: Prisma.UserCreateInput) {
    return await withSchema(async (tx) => {
      return await tx.user.create({
        data,
      });
    });
  }
}
