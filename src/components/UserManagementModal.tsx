import {
    Modal,
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
    Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../services/authService.ts";
import axios from "axios";
import { getToken } from "../services/authService";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

interface User {
    _id: string;
    username: string;
    mail: string;
    role: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "90%",
    overflowY: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px"
};

const UserManagementModal: React.FC<Props> = ({ open, onClose }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nuevoPassword, setNuevoPassword] = useState("");
    const [nuevoRol, setNuevoRol] = useState("user");

    const getRolNombre = (rol: string) => {
        return rol === "admin" ? "Administrador" : "Usuario";
    };

    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    };

    const handleRegister = async () => {
        if (!username || !password) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        const existente = users.find((u: any) => u.username === username);
        if (existente) {
            toast.error("El nombre de usuario ya existe");
            return;
        }

        try {
            await createUser(username, mail, password, role);
            toast.success("Usuario creado exitosamente");
            setUsername("");
            setMail("");
            setPassword("");
            setRole("user");
            loadUsers();
        } catch (err: any) {
            toast.error("Error al crear el usuario");
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
            toast.success("Usuario actualizado");
            setEditandoId(null);
            loadUsers();
        } catch (err) {
            toast.error("Error al actualizar usuario");
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
        if (open) {
            loadUsers();
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h4" gutterBottom>Gestión de Usuarios</Typography>

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
                    <Button variant="contained" onClick={handleRegister} sx={{ backgroundColor: "var(--primary)", color: "var(--white)" }}>Crear</Button>
                </Box>

                <Paper>
                    <Table>
                        <TableHead sx={{
                            backgroundColor: "var(--primary)",
                            "& .MuiTableCell-head": {
                                color: "var(--white)",
                                fontWeight: "bold",
                                fontSize: "14px",
                                textTransform: "uppercase"
                            }
                        }}>
                            <TableRow
                                hover
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "var(--light-gray)"
                                    }
                                }}>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Correo Electrónico</TableCell>
                                <TableCell>Rol</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((u: any) => (
                                <TableRow key={u._id}
                                    hover
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "var(--light-gray)"
                                        }
                                    }}>
                                    <TableCell sx={{ fontSize: "14px", padding: "12px 16px" }}>{u.username}</TableCell>
                                    <TableCell sx={{ fontSize: "14px", padding: "12px 16px" }}>{u.mail}</TableCell>
                                    <TableCell sx={{ fontSize: "14px", padding: "12px 16px" }}>
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
                                            getRolNombre(u.role)
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
                                                    sx={{ mr: 1 }}
                                                >
                                                    Guardar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="secondary"
                                                    onClick={() => setEditandoId(null)}
                                                >
                                                    Cancelar
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
        </Modal>
    );
};

export default UserManagementModal;
