import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/Auth.css";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Paper
} from "@mui/material";

interface LoginPageProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, setUserRole}) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(usuario, contrasena);
      const userString = localStorage.getItem("user");
      const userObj = userString ? JSON.parse(userString) : null;
      setIsAuthenticated(true);
      setUserRole(userObj?.role);
    } catch (error: any) {
      console.error(error);
      setMensaje(error.response?.data?.message || "Error en el login");
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ backgroundColor: "var(--background)" }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          width: 600,
          borderRadius: 3,
          textAlign: "center"
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "var(--primary)", fontWeight: "bold" }}>
          Iniciar Sesión
        </Typography>

        {mensaje && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mensaje}
          </Alert>
        )}

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
            sx={{
              mt: 3,
              backgroundColor: "var(--primary)",
              color: "var(--white)",
              fontWeight: "bold",
              textTransform: "uppercase",
              "&:hover": {
                backgroundColor: "var(--selected)"
              }
            }}
          >
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
