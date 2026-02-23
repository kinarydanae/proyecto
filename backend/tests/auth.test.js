const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("API Auth", () => {
  const usuarioTest = { nombre: "Usuario Jest", correo: "jestuser@test.com", password: "123456", role: "admin" };

  test("POST /api/auth/register debe crear usuario", async () => {
    const res = await request(app).post("/api/auth/register").send(usuarioTest);
    expect([201, 400]).toContain(res.statusCode);
  });

  test("POST /api/auth/login debe devolver token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      correo: usuarioTest.correo,
      password: usuarioTest.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login con password incorrecta debe fallar", async () => {
    const res = await request(app).post("/api/auth/login").send({
      correo: usuarioTest.correo,
      password: "wrongpassword"
    });
    expect(res.statusCode).toBe(401);
  });
});