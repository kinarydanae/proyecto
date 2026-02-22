import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Login from "./pages/Login"; 
import Admin from "./pages/Admin";
import RegisterUser from "./pages/RegisterUser";
import Conciencia from "./pages/Conciencia";  

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/RegisterUser.jsx" element={<RegisterUser />} />
        <Route path="/conciencia" element={<Conciencia />} />
      </Routes>
    </Router>
  );
}