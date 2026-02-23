const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const jwt = require("jsonwebtoken");
const Registro = require("../models/Registro");

let mongoServer;

function crearToken(role) {
  return jwt.sign({ id: "123", nombre: "Test", role }, process.env.JWT_SECRET || 'secret', { expiresIn: "1h" });
}

beforeAll(async () => {
  await mongoose.disconnect(); // Desconectar cualquier intento previo
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("API REGISTROS TEST COMPLETO", () => {
  let tokenAdmin = crearToken("admin");
  let tokenUser = crearToken("user");
  let registroId;

  test("POST /api/registros → crear registro", async () => {
    const res = await request(app)
      .post("/api/registros")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ nombre: "Registro Test", correo: "test@test.com", actividad: "Testing Jest" });
    
    expect(res.statusCode).toBe(201);
    const reg = await Registro.findOne({ correo: "test@test.com" });
    registroId = reg._id.toString();
  });

  test("GET /api/registros con token → 200", async () => {
    const res = await request(app).get("/api/registros").set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
  });

  test("PUT /api/registros/:id como admin → 200", async () => {
    const res = await request(app)
      .put(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ nombre: "Registro Actualizado" });
    expect(res.statusCode).toBe(200);
  });

  test("DELETE como admin → 200", async () => {
    const res = await request(app)
      .delete(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(200);
  });
});