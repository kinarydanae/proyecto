import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterUser.css";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://proyecto-1-m0ao.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "user" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al registrar usuario");
      }

      alert("Cuenta creada exitosamente!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="register-container">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarme</button>
          {error && <p className="register-error">{error}</p>}
        </form>
        <p className="register-login-link">
          ¿Ya tienes una cuenta?{" "}
          <span onClick={() => navigate("/login")}>Inicia sesión</span>
        </p>
      </div>
  );
}