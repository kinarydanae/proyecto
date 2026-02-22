import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src="/img/logo.png" alt="Logo Lucielle's designs" />
        </Link>
        <Link to="/" className="navbar-link">Inicio</Link>
        <Link to="/registro" className="navbar-link">Registrarme</Link>
        <Link to="/conciencia" className="navbar-link">Conciencia Ambiental</Link>
      </div>

      <div className="navbar-right">
        {role === "admin" && (
          <Link to="/admin" className="navbar-admin-btn">
            Panel Admin
          </Link>
        )}
        <button className="navbar-logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}