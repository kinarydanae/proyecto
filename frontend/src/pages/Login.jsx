import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await loginRequest({ correo, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page-bg">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
          {error && <p className="login-error">{error}</p>}
        </form>
        <p className="login-register-link">
          ¿No tienes una cuenta?{" "}
          <span onClick={() => navigate("/RegisterUser.jsx")}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  );
}

export default Login;