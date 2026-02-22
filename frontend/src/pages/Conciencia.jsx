import React from "react";
import Navbar from "../components/Navbar";
import WeatherWidget from "../components/WeatherWidget";
import "./Conciencia.css";

export default function Conciencia() {
  return (
    <>
      <Navbar />
      <div className="conciencia-page">
        <div className="conciencia-hero">
          <h1>Conciencia Ambiental</h1>
          <p>
            En <strong>Lucielle's Designs</strong>, creemos que la moda no debe 
            costarle al planeta. Monitoreamos en tiempo real las condiciones 
            de nuestras sedes principales.
          </p>
        </div>

        <section className="weather-section">
          <h2>Estado Ambiental en Tiempo Real</h2>
          <div className="weather-grid">
            <WeatherWidget city="Guadalajara" />
            <WeatherWidget city="CDMX" />
            <WeatherWidget city="Monterrey" />
          </div>
        </section>

        <div className="conciencia-info">
          <h3>¿Por qué medimos esto?</h3>
          <p>
            La industria textil es responsable del 10% de las emisiones globales 
            de carbono. Al mostrarte estos datos, reafirmamos nuestro compromiso 
            con la transparencia y la sostenibilidad.
          </p>
        </div>
      </div>
    </>
  );
}