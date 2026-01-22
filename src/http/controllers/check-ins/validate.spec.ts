import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Validate CheckIn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to validate checkIn", async () => {
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

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
