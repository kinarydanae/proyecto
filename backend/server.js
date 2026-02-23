const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

require("dotenv").config();

const Registro = require("./models/Registro");
const authRoutes = require("./auth");

const { verificarToken } = require("./middleware/auth");
const verificarRol = require("./middleware/roleMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// MIDDLEWARES
app.use(cors()); // Permite que el Frontend se conecte
app.use(express.json());

// RUTAS DE AUTENTICACIÓN
app.use("/api/auth", authRoutes);

// RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor de Lucielle funcionando correctamente");
});

// PAGINACIÓN DE REGISTROS
app.get("/api/registros", verificarToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const registros = await Registro.find().skip(skip).limit(limit);
    const total = await Registro.countDocuments();

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      registros
    });
  } catch (error) {
    next(error);
  }
});

// OBTENER REGISTRO POR ID
app.get("/api/registros/:id", verificarToken, async (req, res, next) => {
  try {
    const registro = await Registro.findById(req.params.id);
    if (!registro) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }
    res.json(registro);
  } catch (error) {
    res.status(400).json({ message: "ID inválido" });
  }
});

// CREAR REGISTRO
app.post("/api/registros", verificarToken, async (req, res) => {
  try {
    const { nombre, correo, actividad } = req.body;
    if (!nombre || !correo || !actividad) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    const nuevoRegistro = new Registro({ nombre, correo, actividad });
    await nuevoRegistro.save();
    res.status(201).json({ mensaje: "Registro creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear registro" });
  }
});

// ACTUALIZAR REGISTRO (SOLO ADMIN)
app.put("/api/registros/:id", verificarToken, verificarRol("admin"), async (req, res, next) => {
  try {
    const actualizado = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: "ID inválido" });
  }
});

// ELIMINAR (SOLO ADMIN)
app.delete("/api/registros/:id", verificarToken, verificarRol("admin"), async (req, res, next) => {
  try {
    const eliminado = await Registro.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: "Registro no encontrado" });
    }
    res.json({ mensaje: "Registro eliminado" });
  } catch (error) {
    res.status(400).json({ message: "ID inválido" });
  }
});

// API EXTERNA DIVISAS
app.get("/api/currency", async (req, res, next) => {
  try {
    const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD");
    res.json(response.data);
  } catch (error) {
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
    res.json({ name: city, temp: 22, desc: "Cielo despejado (Modo Respaldo)", aqi: 1 });
  }
});

// MANEJO DE RUTAS NO ENCONTRADAS (Reemplaza el comodín * que fallaba)
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada en el API" });
});



// MANEJO GLOBAL DE ERRORES
app.use(errorHandler);

// INICIO DEL SERVIDOR 
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
  });
}

module.exports = app;

// --- ESTE BLOQUE REEMPLAZA AL ANTERIOR ---


if (process.env.NODE_ENV !== "test") {
  const dbURI = process.env.MONGO_URI;
  if (dbURI) {
    mongoose.connect(dbURI, { serverSelectionTimeoutMS: 2000 }) // Bajamos a 2s para que no bloquee
      .then(() => {
        console.log("MongoDB conectado exitosamente (Atlas)");
        app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));
      })
      .catch(err => {
        console.error("Error conectando a MongoDB Atlas:", err.message);
        // Opcional: Iniciar el server aunque Atlas falle
        app.listen(PORT, () => console.log(`Servidor activo sin DB (Error Atlas)`));
      });
  }
}

module.exports = app;