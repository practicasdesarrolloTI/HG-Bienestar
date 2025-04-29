import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import { Link } from "react-router-dom"; // Asegúrate de importar

interface LoginPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(usuario, contrasena);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error en el login");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>
        <label>
          Contraseña:
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default LoginPage;
