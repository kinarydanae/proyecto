const request = require("supertest");
const app = require("../server");

describe("API Auth", () => {

  const usuarioTest = {
    nombre: "Usuario Jest",
    correo: "jestuser@test.com",
    password: "123456",
    role: "admin"
  };

  // TEST REGISTRO
  test("POST /api/auth/register debe crear usuario", async () => {

    const res = await request(app)
      .post("/api/auth/register")
      .send(usuarioTest);

    // puede ser 201 o 400 si ya existe
    expect([201, 400]).toContain(res.statusCode);

  });


  // TEST LOGIN CORRECTO
  test("POST /api/auth/login debe devolver token", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        correo: usuarioTest.correo,
        password: usuarioTest.password
      });

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("token");

  });


  // TEST LOGIN INCORRECTO
  test("POST /api/auth/login con password incorrecta debe fallar", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        correo: usuarioTest.correo,
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);

  });


  // TEST LOGIN SIN DATOS
  test("POST /api/auth/login sin datos debe fallar", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.statusCode).toBe(400);

  });

}); // Cerrar conexión después de tests
const mongoose = require("mongoose");
afterAll(async () => {
  await mongoose.connection.close();
});