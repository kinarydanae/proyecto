# Lucielle’s Designs - Fashion & Sustainability Web App 

Este proyecto es una aplicación web **Full Stack** diseñada para gestionar el registro de usuarios en actividades de moda sostenible. La plataforma integra servicios externos, seguridad avanzada y un sistema de gestión de datos robusto.

## Despliegue 
- https://proyecto-2-tmay.onrender.com

## Tecnologías Utilizadas
- **Backend:** Node.js, Express.js.
- **Frontend:** React, React Router.
- **Base de Datos:** MongoDB Atlas (Producción), MongoDB Memory Server (Tests).
- **Seguridad:** JSON Web Tokens (JWT) y BCrypt para encriptación.
- **APIs Externas:** OpenWeather API (Clima en tiempo real).
- **Pruebas:** Jest y Supertest.

## Características Principales
- **Sistema de Roles (RBAC):** Diferenciación entre `admin` y `user`.
- **Paginación:** Optimización de carga de datos en el Panel de Administración.
- **Seguridad:** Rutas protegidas y validación de tokens.
- **Resiliencia:** Manejo de errores en APIs externas con "Modo de Respaldo".
