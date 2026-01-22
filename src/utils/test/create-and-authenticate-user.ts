import request from "supertest";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `${randomUUID()}@email.com`;
  
  await request(app.server).post("/users").send({
    name: "John Doe",
    email,
    password: "123456",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email,
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token, email };
}
