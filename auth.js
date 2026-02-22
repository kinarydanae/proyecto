const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("./models/Usuario");

const router = express.Router();

// REGISTRO
router.post("/register", async (req, res, next) => {

  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios"
      });
    }

    const usuarioExistente = await Usuario.findOne({ correo });

    if (usuarioExistente) {
      return res.status(400).json({
        error: "Usuario ya existe"
      });
    }

    const usuario = new Usuario({
      nombre,
      correo,
      password
    });
    await usuario.save();
    res.status(201).json({
      mensaje: "Usuario creado exitosamente"
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {

  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({
        error: "Correo y contraseña son obligatorios"
      });
    }

    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos"
      });
    }

    const esValido = await usuario.compararPassword(password);

    if (!esValido) {
      return res.status(401).json({
        error: "Usuario o contraseña incorrectos"
      });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        role: usuario.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    res.json({
      token,
      role: usuario.role,
      nombre: usuario.nombre
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;