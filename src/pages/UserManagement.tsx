import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Paper
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../services/authService.ts";
import axios from "axios";
import { getToken } from "../services/authService";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert } from "@mui/material";

interface User {
  _id: string;
  username: string;
  mail: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "error">("success");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [nuevoRol, setNuevoRol] = useState("user");


  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setTipoMensaje("error");
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    const existente = users.find((u: any) => u.username === username);
    if (existente) {
      setTipoMensaje("error");
      setMensaje("El nombre de usuario ya existe");
      return;
    }

    try {
      await createUser(username, mail, password, role);
      setTipoMensaje("success");
      setMensaje("Usuario creado exitosamente");
      setUsername("");
      setMail("");
      setPassword("");
      setRole("user");
      loadUsers();
    } catch (err: any) {
      setTipoMensaje("error");
      setMensaje("Error al crear el usuario");
    }
  };

  const handleActualizarUsuario = async (id: string) => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8001/api/auth/${id}`, {
        password: nuevoPassword,
        role: nuevoRol,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje("Usuario actualizado");
      setTipoMensaje("success");
      setEditandoId(null);
      loadUsers();
    } catch (err) {
      setMensaje("Error al actualizar usuario");
      setTipoMensaje("error");
    }
  };



  const handleDelete = async (id: string) => {
    const token = getToken();
    await axios.delete(`http://localhost:8001/api/auth/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box maxWidth={800} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>Gestión de Usuarios</Typography>

      {mensaje && (
        <Alert severity={tipoMensaje} sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Correo Electrónico"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)} fullWidth>
          <MenuItem value="user">Usuario</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleRegister}>Crear</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u._id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.mail}</TableCell>
                <TableCell>
                  {editandoId === u._id ? (
                    <Select
                      value={nuevoRol}
                      onChange={(e) => setNuevoRol(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="user">Usuario</MenuItem>
                      <MenuItem value="admin">Administrador</MenuItem>
                    </Select>
                  ) : (
                    u.role
                  )}
                </TableCell>
                <TableCell align="right">
                  {editandoId === u._id ? (
                    <>
                      <TextField
                        label="Nueva contraseña"
                        size="small"
                        type="password"
                        value={nuevoPassword}
                        onChange={(e) => setNuevoPassword(e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleActualizarUsuario(u._id)}
                      >
                        Guardar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEditandoId(u._id);
                          setNuevoRol(u.role);
                          setNuevoPassword("");
                        }}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <IconButton onClick={() => handleDelete(u._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UserManagement;
