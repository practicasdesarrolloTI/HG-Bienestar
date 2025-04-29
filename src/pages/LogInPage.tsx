import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from "@mui/material";

interface LoginPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [usuario, setUsuario] = useState("Usuario");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(usuario, contrasena);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error en el login");
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <Box maxWidth={400} mx="auto" mt={5}>
        {mensaje && <Alert severity="error">{mensaje}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
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
            Entrar
          </Button>
        </form>

        <Typography variant="body2" align="center" mt={2}>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </Typography>
      </Box>
    </div>
  );
};

export default LoginPage;
