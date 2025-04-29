import React, { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";

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
      <Box maxWidth={400} mx="auto" mt={5}>
        <form onSubmit={handleSubmit}>

        <FormControl fullWidth margin="normal">
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              value={role}
              label="Rol"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">Usuario</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Cédula"
            variant="outlined"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Correo"
            type="email"
            variant="outlined"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            variant="outlined"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Registrarse
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default RegisterPage;
