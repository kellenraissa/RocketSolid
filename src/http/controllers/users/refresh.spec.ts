import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let app: any;

describe("RefreshToken (e2e)", () => {
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

    const authResponse = await request(app.server).post("/sessions").send({
      email: "johsndoe@email.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies!)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
