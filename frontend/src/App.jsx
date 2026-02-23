import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Login from "./pages/Login"; 
import Admin from "./pages/Admin";
import RegisterUser from "./pages/RegisterUser";
import Conciencia from "./pages/Conciencia";  

// para proteger las rutas
const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem("token"); // Verifica si hay sesión

  if (!token) {
    return <Navigate to="/login" />; // Si no hay token, al Login
  }
  return children; // Si hay token, adelante
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas Protegidas (Solo entran si están logueados) */}
        <Route path="/" element={
          <RutaProtegida>
            <Home />
          </RutaProtegida>
        } />
        
        <Route path="/admin" element={
          <RutaProtegida>
            <Admin />
          </RutaProtegida>
        } />

        <Route path="/conciencia" element={
          <RutaProtegida>
            <Conciencia />
          </RutaProtegida>
        } />

        <Route path="/register-user" element={<RegisterUser />} />
        
      </Routes>
    </Router>
  );
}