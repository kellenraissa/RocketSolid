import request from "supertest";
// import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let app: any;

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    const mod = await import("@/app");
    app = mod.app;
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("shoul be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johsndoe@email.com",
      password: "123456",
    });

    const response = await await request(app.server).post("/sessions").send({
      email: "johsndoe@email.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
