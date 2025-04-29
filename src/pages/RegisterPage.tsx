import React, { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [cedula, setCedula] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(cedula, correo, contrasena, role);
      alert("Registro exitoso, ¡ya puedes iniciar sesión!");
      navigate("/"); // ✅ te lleva directamente al login
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error en el registro");
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rol:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <label>
          Cédula:
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            required
          />
        </label>
        <label>
          Correo:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterPage;
