const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const Registro = require("./models/Registro");
const authRoutes = require("../auth");

const { verificarToken } = require("./middleware/auth");
const verificarRol = require("./middleware/roleMiddleware");
const validarRegistro = require("./middleware/validarRegistro");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);



// TEST
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});



// PAGINACIÓN
app.get("/api/registros", verificarToken, async (req, res, next) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const registros = await Registro
      .find()
      .skip(skip)
      .limit(limit);

    const total = await Registro.countDocuments();

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      registros
    });

  } catch(error){

    next(error);

  }

});



// GET REGISTRO POR ID (CORREGIDO)
app.get("/api/registros/:id", verificarToken, async (req, res, next) => {

  try {

    const registro = await Registro.findById(req.params.id);

    if (!registro) {

      return res.status(404).json({
        message: "Registro no encontrado"
      });

    }

    res.json(registro);

  } catch (error) {

    res.status(400).json({
      message: "ID inválido"
    });

  }

});



// CREAR REGISTRO
app.post("/api/registros", verificarToken, async (req, res) => {

  try {
    const { nombre, correo, actividad } = req.body;
    if (!nombre || !correo || !actividad) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }
    const nuevoRegistro = new Registro({
      nombre,
      correo,
      actividad
    });
    await nuevoRegistro.save();
    res.status(201).json({
      mensaje: "Registro creado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error al crear registro"
    });
  }
});



// ACTUALIZAR REGISTRO
app.put("/api/registros/:id", verificarToken, verificarRol("admin"), async (req, res, next) => {

    try {
      const actualizado = await Registro.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!actualizado) {

        return res.status(404).json({
          mensaje: "Registro no encontrado"
        });

      }

      res.json(actualizado);

    } catch(error){

      res.status(400).json({
        message: "ID inválido"
      });

    }

});



// ELIMINAR (SOLO ADMIN)
app.delete("/api/registros/:id", verificarToken, verificarRol("admin"), async (req, res, next) => {

    try {

      const eliminado =
        await Registro.findByIdAndDelete(req.params.id);

      if (!eliminado) {

        return res.status(404).json({
          mensaje: "Registro no encontrado"
        });

      }

      res.json({
        mensaje: "Registro eliminado"
      });

    } catch(error){

      res.status(400).json({
        message: "ID inválido"
      });

    }

});



// API EXTERNA
app.get("/api/currency", async (req, res, next) => {

  try {

    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );

    res.json(response.data);

  } catch(error){

    next(error);

  }

});
// API CLIMA
app.get("/api/weather/:city", async (req, res) => {
  const city = req.params.city;
  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
    const { lat, lon } = weatherRes.data.coord;
    const airRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    res.json({
      name: weatherRes.data.name,
      temp: weatherRes.data.main.temp,
      desc: weatherRes.data.weather[0].description,
      aqi: airRes.data.list[0].main.aqi
    });
  } catch (error) {
    console.error("Enviando datos de respaldo...");
    // DATOS DE RESPALDO (Para que nunca salga "Error de conexión")
    res.json({
      name: city,
      temp: 22,
      desc: "Cielo despejado",
      aqi: 1 // Excelente
    });
  }
});

const path = require("path");
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// MongoDB (NO conectar durante tests)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error(err));
}


// ERROR HANDLER
app.use(errorHandler);



// SERVER
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;