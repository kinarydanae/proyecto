  const mongoose = require("mongoose");

  const registroSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true
    },
    actividad: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model("Registro", registroSchema);