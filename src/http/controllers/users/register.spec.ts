import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to register", async () => {
    const email = `${randomUUID()}@email.com`;
    
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
