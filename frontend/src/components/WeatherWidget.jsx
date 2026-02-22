import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherWidget.css";

export default function WeatherWidget({ city }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // Función para interpretar el AQI (Calidad del Aire)
  const getAqiInfo = (aqi) => {
    const levels = {
      1: { label: "Excelente", class: "aqi-1" },
      2: { label: "Bueno", class: "aqi-2" },
      3: { label: "Regular", class: "aqi-3" },
      4: { label: "Malo", class: "aqi-4" },
      5: { label: "Muy Malo", class: "aqi-5" },
    };
    return levels[aqi] || { label: "Desconocido", class: "" };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/weather/${city}`);
        setData(res.data);
      } catch (err) {
        setError("Error de conexión");
      }
    };
    fetchData();
  }, [city]);

  if (error) return <div className="weather-widget error">{error}</div>;
  if (!data) return <div className="weather-widget loading">Cargando...</div>;

  const aqiInfo = getAqiInfo(data.aqi);

  return (
    <div className="weather-widget">
      <h3>{data.name}</h3>
      <p className="weather-desc">{data.desc}</p>
      <p className="weather-temp">{Math.round(data.temp)}°C</p>
      
      <div className={`aqi-badge ${aqiInfo.class}`}>
        Aire: {aqiInfo.label}
      </div>
    </div>
  );
}