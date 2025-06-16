import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getProgramSpecialties,
  createProgramSpecialty,
  updateProgramSpecialty,
  deleteProgramSpecialty,
} from "../services/programSpecialtyService";
import { toast } from "react-toastify";
import { Programs } from "../types/Programs.type";
import "../styles/ProgramModal.css";

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
  borderRadius: "8px",
};

const ProgramSpecialtyModal: React.FC<Props> = ({ open, onClose }) => {
  const [programs, setPrograms] = useState<Programs[]>([]);
  const [programName, setProgramName] = useState("");
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editProgramName, setEditProgramName] = useState("");
  const [editSpecialtyInput, setEditSpecialtyInput] = useState("");
  const [editSpecialties, setEditSpecialties] = useState<string[]>([]);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(
    null
  );

  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const loadPrograms = async () => {
    try {
      const data = await getProgramSpecialties();
      setPrograms(data as Programs[]);
    } catch (err) {
      toast.error("Error al cargar programas");
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      loadPrograms();
    }
  }, [open]);

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const handleCreate = async () => {
    if (!programName || specialties.length === 0) {
      toast.error("Debe completar todos los campos");
      return;
    }

    try {
      await createProgramSpecialty(programName, specialties);
      toast.success("Programa creado exitosamente");
      setProgramName("");
      setSpecialties([]);
      loadPrograms();
    } catch (err) {
      toast.error("Error al crear programa");
      console.error(err);
    }
  };

  const handleAddEditSpecialty = () => {
    if (
      editSpecialtyInput.trim() &&
      !editSpecialties.includes(editSpecialtyInput.trim())
    ) {
      setEditSpecialties([...editSpecialties, editSpecialtyInput.trim()]);
      setEditSpecialtyInput("");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editProgramName || editSpecialties.length === 0) {
      toast.error("Debe completar todos los campos");
      return;
    }

    try {
      await updateProgramSpecialty(id, editProgramName, editSpecialties);
      toast.success("Programa actualizado exitosamente");
      setEditandoId(null);
      loadPrograms();
    } catch (err) {
      toast.error("Error al actualizar programa");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingDeleteId(id);
    try {
      await deleteProgramSpecialty(id);
      toast.success("Programa eliminado");
      loadPrograms();
    } catch (err) {
      toast.error("Error al eliminar programa");
      console.error(err);
    } finally {
      setLoadingDeleteId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" gutterBottom>
          Gestión de Programas y Especialidades
        </Typography>

        {/* Formulario de creación */}
        <Box className="form-container">
          <TextField
            label="Nombre del programa"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
          />

          <TextField
            label="Especialidad"
            value={specialtyInput}
            onChange={(e) => setSpecialtyInput(e.target.value)}
          />
          <Box mb={2}>
            <Typography variant="subtitle2" mr={10}>
              Especialidades:
            </Typography>
            {specialties.map((s, idx) => (
              <Typography key={idx} variant="body2">
                • {s}
              </Typography>
            ))}
          </Box>
          <Button
            variant="contained"
            onClick={handleAddSpecialty}
            className="add-button"
          >
            Agregar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            className="create-button"
          >
            Crear Programa
          </Button>
        </Box>

        {/* Tabla de programas */}
        <Paper>
          <Table>
            <TableHead
              sx={{
                backgroundColor: "var(--dark-blue)",
                "& .MuiTableCell-head": {
                  color: "var(--white)",
                  fontWeight: "bold",
                  fontSize: "14px",
                  textTransform: "uppercase",
                },
              }}
            >
              <TableRow>
                <TableCell>Programa</TableCell>
                <TableCell>Especialidades</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((p: Programs) => (
                <TableRow
                  key={p._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--light-gray)",
                    },
                  }}
                >
                  <TableCell>
                    {editandoId === p._id ? (
                      <TextField
                        value={editProgramName}
                        onChange={(e) => setEditProgramName(e.target.value)}
                        size="small"
                        fullWidth
                      />
                    ) : (
                      p.program
                    )}
                  </TableCell>
                  <TableCell>
                    {editandoId === p._id ? (
                      <>
                        <Box display="flex" gap={1} mb={1}>
                          <TextField
                            label="Especialidad"
                            value={editSpecialtyInput}
                            onChange={(e) =>
                              setEditSpecialtyInput(e.target.value)
                            }
                            size="small"
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddEditSpecialty}
                          >
                            Agregar
                          </Button>
                        </Box>
                        {editSpecialties.map((s, idx) => (
                          <Typography key={idx} variant="body2">
                            • {s}
                          </Typography>
                        ))}
                      </>
                    ) : (
                      p.specialties.map((s: string, idx: number) => (
                        <Typography key={idx} variant="body2">
                          • {s}
                        </Typography>
                      ))
                    )}
                  </TableCell>
                  <TableCell>
                    {editandoId === p._id ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleUpdate(p._id)}
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
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setEditandoId(p._id);
                          setEditProgramName(p.program);
                          setEditSpecialties(p.specialties);
                          setEditSpecialtyInput("");
                        }}
                        className="edit-button"
                      >
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => setConfirmarEliminarId(p._id)}
                      className="delete-button"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog
            open={Boolean(confirmarEliminarId)}
            onClose={() => setConfirmarEliminarId(null)}
          >
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              ¿Estás seguro que deseas eliminar este programa?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmarEliminarId(null)}>
                Cancelar
              </Button>
              <Button
                color="error"
                onClick={async () => {
                  if (confirmarEliminarId) {
                    await handleDelete(confirmarEliminarId);
                    setConfirmarEliminarId(null);
                  }
                }}
                disabled={loadingDeleteId === confirmarEliminarId}
              >
                {loadingDeleteId === confirmarEliminarId
                  ? "Eliminando..."
                  : "Eliminar"}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Modal>
  );
};

export default ProgramSpecialtyModal;
