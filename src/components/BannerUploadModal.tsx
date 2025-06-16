import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  TableContainer,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import {
  subirBanner,
  obtenerBanners,
  actualizarBanner,
  eliminarBanner,
  activarBanner,
} from "../services/bannerService";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "../styles/BannerUploadModal.css";
import { BannersData } from "../types/Banners.type";

// const style = {
//     position: "absolute" as const,
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: "80%",
//     maxHeight: "90%",
//     overflowY: "auto",
//     bgcolor: "background.paper",
//     boxShadow: 24,
//     p: 4,
//     borderRadius: "8px"
// };

interface Props {
  open: boolean;
  onClose: () => void;
}

const BannerUploadModal: React.FC<Props> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [banners, setBanners] = useState<BannersData[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(
    null
  );
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [loadingActivateId, setLoadingActivateId] = useState<string | null>(
    null
  );

  // Estado de carga
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingUpdateId, setLoadingUpdateId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

  const loadBanners = async () => {
    setLoadingBanners(true);
    try {
      const data = await obtenerBanners();
      setBanners(data as BannersData[]);
    } catch (err) {
      toast.error("Error al cargar banners");
      console.error(err);
    } finally {
      setLoadingBanners(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadBanners();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Por favor selecciona una imagen.");
      return;
    }

    setLoadingSubmit(true);
    try {
      await subirBanner(title, imageFile);
      toast.success("Banner subido correctamente");
      setTitle("");
      setImageFile(null);
      setPreview(null);
      loadBanners();
    } catch (err) {
      console.error("Error al subir banner:", err);
      toast.error("Error al subir el banner");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActualizar = async (id: string) => {
    setLoadingUpdateId(id);
    try {
      await actualizarBanner(id, editTitle, editImageFile || undefined);
      toast.success("Banner actualizado");
      setEditandoId(null);
      setEditImageFile(null);
      loadBanners();
    } catch (err) {
      console.error("Error al actualizar banner", err);
      toast.error("Error al actualizar");
    } finally {
      setEditPreview(null);
      setLoadingUpdateId(null);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditTitle("");
    setEditImageFile(null);
    setEditPreview(null);
  };

  const handleEliminar = async () => {
    if (!confirmarEliminarId) return;
    setLoadingDeleteId(confirmarEliminarId);
    try {
      await eliminarBanner(confirmarEliminarId);
      toast.success("Banner eliminado");
      setConfirmarEliminarId(null);
      loadBanners();
    } catch (err) {
      console.error("Error al eliminar banner", err);
      toast.error("Error al eliminar");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleActivar = async (id: string) => {
    setLoadingActivateId(id);
    try {
      await activarBanner(id);
      toast.success("Banner activado");
      loadBanners();
    } catch (err) {
      console.error("Error al activar banner", err);
      toast.error("Error al activar");
    } finally {
      setLoadingActivateId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="banner-modal">
        <Typography variant="h4" gutterBottom>
          Gestión de Banners
        </Typography>

        {/* Formulario nuevo banner */}

        <form onSubmit={handleSubmit}>
          <div className="banner-upload-container">
          
            <TextField
              fullWidth
              variant="outlined"
              label="Nombre del banner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="dense"
              required
              className="banner-title-input"
            />
            <Button
              variant="contained"
              component="label"
              className="banner-upload-button"
              sx={{ textTransform: "none" }}
            >
              Seleccionar Imagen
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loadingSubmit}
              className="banner-upload-button"
              sx={{ textTransform: "none" }}
            >
              {loadingSubmit ? "Subiendo..." : "Subir Banner"}
            </Button>
            {preview && (
              <Box mb={2}>
                <Typography variant="body1" sx={{ color: "-moz-initial" }}>
                  Vista previa:
                </Typography>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
          </div>
        </form>

        {/* Tabla de banners */}
        <div className="banner-table">
          <Typography className="banner-table-title" variant="h5">
            Banners
          </Typography>
          <TableContainer>
            <Table className="banner-table-content">
              <TableHead className="banner-table-header">
                <TableRow className="banner-table-header-row">
                  <TableCell>Imagen</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Ultima Actualización</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingBanners ? (
                  <TableRow className="banner-table-row">
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((banner: BannersData) => (
                    <TableRow key={banner.id} className="banner-table-row">
                      <TableCell className="banner-table-cell">
                        <Avatar
                          src={
                            editandoId === banner.id && editPreview
                              ? editPreview
                              : banner.image
                          }
                          variant="rounded"
                          sx={{ width: 200, height: 100 }}
                        />
                      </TableCell>
                      <TableCell className="banner-table-cell">
                        {editandoId === banner.id ? (
                          <TextField
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          banner.title
                        )}
                      </TableCell>
                      <TableCell className="banner-table-cell">
                        {banner.Fecha_Actualizacion
                          ? new Date(banner.Fecha_Actualizacion).toLocaleString(
                              "es-CO",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="banner-table-cell">
                        {banner.active ? (
                          <Chip label="Habilitado" color="success" />
                        ) : (
                          <Chip label="Deshabilitado" color="default" />
                        )}
                      </TableCell>
                      <TableCell className="banner-table-cell">
                        {editandoId === banner.id ? (
                          <div className="banner-edit-actions">
                            <Button
                              sx={{ textTransform: "none" }}
                              variant="contained"
                              size="small"
                              className="banner-edit-image-button"
                            >
                              Actualizar
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleEditFileChange}
                              />
                            </Button>
                            <Button
                              sx={{ textTransform: "none" }}
                              variant="contained"
                              size="small"
                              onClick={() => handleActualizar(banner.id)}
                              disabled={loadingUpdateId === banner.id}
                              className="banner-save-button"
                            >
                              {loadingUpdateId === banner.id
                                ? "Actualizando..."
                                : "Guardar"}
                            </Button>
                            <Button
                              sx={{ textTransform: "none" }}
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={cancelarEdicion}
                              className="banner-cancel-button"
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <>
                            {banner.active ? (
                              <>
                                {/* Botón Editar */}
                                <IconButton
                                  onClick={() => {
                                    setEditandoId(banner.id);
                                    setEditTitle(banner.title);
                                  }}
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon />
                                </IconButton>

                                {/* Botón Eliminar */}
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    setConfirmarEliminarId(banner.id)
                                  }
                                >
                                  <VisibilityOffIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                {/* Botón Activar */}
                                <IconButton
                                  color="primary"
                                  onClick={() => handleActivar(banner.id)}
                                  disabled={loadingActivateId === banner.id}
                                >
                                  {loadingActivateId === banner.id ? (
                                    <CircularProgress size={24} />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* Confirmación de eliminar */}
        <Dialog
          open={Boolean(confirmarEliminarId)}
          onClose={() => setConfirmarEliminarId(null)}
          className="banner-dialog"
        >
          <DialogTitle className="banner-dialog-title">
            Confirmar Deshabilitado
          </DialogTitle>
          <DialogContent className="banner-dialog-content">
            ¿Estás seguro que deseas deshabilitar este banner? No será visible
            para los usuarios de la app.
          </DialogContent>
          <DialogActions className="banner-dialog-actions">
            <Button
              color="error"
              onClick={() => setConfirmarEliminarId(null)}
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              sx={{ textTransform: "none" }}
              color="primary"
              onClick={handleEliminar}
              disabled={loadingDeleteId === confirmarEliminarId}
            >
              {loadingDeleteId === confirmarEliminarId
                ? "Actualizando..."
                : "Actualizar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default BannerUploadModal;
