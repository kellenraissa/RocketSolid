import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { cleanDatabase } from "@/utils/test/clean-database";
import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const currentSchema: any = await prisma.$queryRawUnsafe(
      "select current_schema() as schema",
    );
    console.log("APP current_schema:", currentSchema[0].schema);

    const db: any = await prisma.$queryRawUnsafe(
      "select current_database() as db",
    );
    console.log("APP current_database:", db[0].db);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "123232123",
        latitude: -27.0610928,
        longitude: -49.6401091,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description",
        phone: "123232123",
        latitude: -27.0610928,
        longitude: -49.5229501,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -27.0610928,
        longitude: -49.6401091,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    // expect(response.body.gyms).toHaveLength(1);
    // expect(response.body.gyms).toEqual([
    //   expect.objectContaining({
    //     title: "JavaScript Gym",
    //   }),
    // ]);
  });
});
