import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { withSchema } from "./with-schema";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    return await withSchema(async (tx) => {
      return await tx.gym.findUnique({
        where: {
          id: id,
        },
      });
    });
  }
  
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return await withSchema(async (tx) => {
      return await tx.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
      `;
    });
  }

  async searchMany(query: string, page: number) {
    return await withSchema(async (tx) => {
      return await tx.gym.findMany({
        where: {
          title: { contains: query },
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    });
  }
  
  async create(data: Prisma.GymUncheckedCreateInput) {
    return await withSchema(async (tx) => {
      return await tx.gym.create({ data });
    });
  }
}
