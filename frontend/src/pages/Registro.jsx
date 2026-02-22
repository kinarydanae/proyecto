import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Registro.css";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    actividad: ""
  });

  const token = localStorage.getItem("token"); // verifica que exista

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Debes iniciar sesión para registrarte.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/registros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("No se pudo guardar el registro.");

      const data = await res.json();
      console.log(data);

      alert("Registro enviado exitosamente!");
      setFormData({ nombre: "", correo: "", actividad: "" });
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor. Revisa tu backend.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="registro-container">
        <h2>Registrarme a una actividad</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo (ej: correo@dominio.com)"
            value={formData.correo}
            onChange={handleChange}
            pattern=".+@.+\..+"
            title="Debe contener @ y un dominio válido"
            required
          />
          <select
            name="actividad"
            value={formData.actividad}
            onChange={handleChange}
            required
          >
            <option value="">--Selecciona una actividad--</option>
            <option value="Donaciones">Donaciones</option>
            <option value="Taller de reciclaje">Taller de reciclaje</option>
            <option value="Eventos de moda sostenible">Eventos de moda sostenible</option>
          </select>
          <button type="submit">Registrarme</button>
        </form>
      </div>
    </>
  );
}