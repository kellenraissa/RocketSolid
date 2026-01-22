import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Check-in Metrics (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to get the metrics count of checkins", async () => {
    const { token, email } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
    });

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        description: "Some description",
        phone: "123232123",
        latitude: -27.0610928,
        longitude: -49.5229501,
      },
    });

    const checkIns = await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const response = await request(app.server)
      .get(`/check-ins/metrics`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.checkInsCount).toEqual(2);
  });
});
