import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Create gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to create gym", async () => {
    const currentSchema: any = await prisma.$queryRawUnsafe(
      "select current_schema() as schema",
    );
    console.log("APP current_schema:", currentSchema[0].schema);

    const db: any = await prisma.$queryRawUnsafe(
      "select current_database() as db",
    );
    console.log("APP current_database:", db[0].db);

    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description",
        phone: "123232123",
        latitude: -27.0610928,
        longitude: -49.5229501,
      });

    expect(response.statusCode).toEqual(201);
  });
});
