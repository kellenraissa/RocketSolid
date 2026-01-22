import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";
import { withSchema } from "./with-schema";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    return await withSchema(async (tx) => {
      return await tx.checkIn.findUnique({
        where: {
          id,
        },
      });
    });
  }
  
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return await withSchema(async (tx) => {
      return await tx.checkIn.create({ data });
    });
  }
  
  async findManyByUserId(userId: string, page: number) {
    return await withSchema(async (tx) => {
      return await tx.checkIn.findMany({
        where: {
          user_id: userId,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    });
  }
  
  async countByUserId(userId: string) {
    return await withSchema(async (tx) => {
      return await tx.checkIn.count({
        where: {
          user_id: userId,
        },
      });
    });
  }
  
  async findByUserIdOrDate(userId: string, date: Date) {
    return await withSchema(async (tx) => {
      const startOfTheDay = dayjs(date).startOf("date");
      const endOfTheDay = dayjs(date).endOf("date");
      //Quando eu quero buscar uma unica coisa, mas a coluna dela não é unique, preciso usar o find first como created_at
      return await tx.checkIn.findFirst({
        where: {
          user_id: userId,
          created_at: {
            gte: startOfTheDay.toDate(), // prisma só aceita o Dtae primitivo
            lte: endOfTheDay.toDate(),
          },
        },
      });
    });
  }
  
  async save(data: CheckIn) {
    return await withSchema(async (tx) => {
      return await tx.checkIn.update({
        where: {
          id: data.id,
        },
        data: data,
      });
    });
  }
}
