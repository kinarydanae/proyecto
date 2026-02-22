const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Registro = require("../models/Registro");

require("dotenv").config();


// crear token admin
function crearTokenAdmin() {
  return jwt.sign(
    {
      id: "admin123",
      nombre: "Admin Test",
      role: "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}


// crear token usuario normal
function crearTokenUser() {
  return jwt.sign(
    {
      id: "user123",
      nombre: "User Test",
      role: "user"
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}


describe("API REGISTROS TEST COMPLETO", () => {

  let tokenAdmin;
  let tokenUser;
  let registroId;


  beforeAll(async () => {

    tokenAdmin = crearTokenAdmin();
    tokenUser = crearTokenUser();

  });


  // -------------------------
  // GET SIN TOKEN
  // -------------------------
  test("GET /api/registros sin token → 401", async () => {

    const res = await request(app)
      .get("/api/registros");

    expect(res.statusCode).toBe(401);

  });


  // -------------------------
  // POST CREAR REGISTRO
  // -------------------------
  test("POST /api/registros → crear registro", async () => {

    const res = await request(app)
      .post("/api/registros")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nombre: "Registro Test",
        correo: "test@test.com",
        actividad: "Testing Jest"
      });

    expect(res.statusCode).toBe(201);

    // guardar id creado
    const registros = await Registro.findOne({ correo: "test@test.com" });
    registroId = registros._id.toString();

  });


  // -------------------------
  // GET CON TOKEN
  // -------------------------
  test("GET /api/registros con token → 200", async () => {

    const res = await request(app)
      .get("/api/registros")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.registros).toBeDefined();

  });


  // -------------------------
  // PUT ACTUALIZAR REGISTRO
  // -------------------------
  test("PUT /api/registros/:id como admin → 200", async () => {

    const res = await request(app)
      .put(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        nombre: "Registro Actualizado"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Registro Actualizado");

  });


  // -------------------------
  // PUT COMO USER NORMAL → 403
  // -------------------------
  test("PUT como usuario normal → 403", async () => {

    const res = await request(app)
      .put(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({
        nombre: "Hack intento"
      });

    expect(res.statusCode).toBe(403);

  });


  // -------------------------
  // DELETE COMO USER NORMAL → 403
  // -------------------------
  test("DELETE como user → 403", async () => {

    const res = await request(app)
      .delete(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.statusCode).toBe(403);

  });


  // -------------------------
  // DELETE COMO ADMIN → 200
  // -------------------------
  test("DELETE como admin → 200", async () => {

    const res = await request(app)
      .delete(`/api/registros/${registroId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);

  });


});


// cerrar conexión
afterAll(async () => {
  await mongoose.connection.close();
});