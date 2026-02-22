import React from "react";
import Navbar from "../components/Navbar";
import WeatherWidget from "../components/WeatherWidget.jsx";
import "./Home.css";

export default function Home() {
  return (
    <>
      <Navbar />
    <div className="home-container">
      <header className="home-header">
        <div className="home-info">
          <div>
            <h2>¿Quiénes somos?</h2>
            <p>Somos una empresa de diseño creativo enfocada en la moda sostenible.</p>
          </div>
          <div>
            <h2>Misión</h2>
            <p>Transformar ropa usada en piezas únicas y responsables con el ambiente.</p>
          </div>
          <div>
            <h2>Visión</h2>
            <p>Crear moda con conciencia ambiental y social.</p>
          </div>
        </div>
      </header>

      <section className="home-section">
        <h2>Conoce nuestros proyectos destacados</h2>
        <div className="home-cards">
          <div className="home-card">
            <h3>Donaciones</h3>
            <img src="/img/donaciones.jpg" alt="Donaciones de ropa" />
            <p>Recibimos donaciones de ropa usada para transformarla en nuevas piezas.</p>
          </div>
          <div className="home-card">
            <h3>Talleres de reciclaje</h3>
            <img src="/img/talleres.jpg" alt="Taller de reciclaje" />
            <p>Ofrecemos talleres donde enseñamos técnicas para transformar ropa usada.</p>
          </div>
          <div className="home-card">
            <h3>Eventos de moda sostenible</h3>
            <img src="/img/eventos.jpg" alt="Evento de moda sostenible" />
            <p>Organizamos eventos para promover la moda sostenible.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2026 Lucielle's designs. Todos los derechos reservados.</p>
        <div className="redes-sociales">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
      </footer>
    </div>
    </>
  );
}
