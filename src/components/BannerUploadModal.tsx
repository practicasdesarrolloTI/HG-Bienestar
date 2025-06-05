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
    Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import {
    subirBanner,
    obtenerBanners,
    actualizarBanner,
    eliminarBanner,
    activarBanner
} from "../services/bannerService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "../styles/BannerUploadModal.css";


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

    const [banners, setBanners] = useState<any[]>([]);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [confirmarEliminarId, setConfirmarEliminarId] = useState<string | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(null);
    const [loadingActivateId, setLoadingActivateId] = useState<string | null>(null);


    // Estado de carga
    const [loadingBanners, setLoadingBanners] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingUpdateId, setLoadingUpdateId] = useState<string | null>(null);
    const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);

    const loadBanners = async () => {
        setLoadingBanners(true);
        try {
            const data = await obtenerBanners();
            setBanners(data as any[]);
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
                <Typography variant="h4" gutterBottom>Gestión de Banners</Typography>

                {/* Formulario nuevo banner */}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        margin="dense"
                        required
                    />

                    <Button
                        variant="contained"
                        component="label"
                        className="banner-upload-button"
                    >
                        Seleccionar Imagen
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>

                    {preview && (
                        <Box mb={2}>
                            <Typography variant="body1" sx={{color: "-moz-initial"}}>Vista previa:</Typography>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain" }}
                            />
                        </Box>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loadingSubmit}
                        className="banner-submit-button"
                    >
                        {loadingSubmit ? "Subiendo..." : "Subir Banner"}
                    </Button>
                </form>

                {/* Tabla de banners */}
                <Typography variant="h6" mt={4} gutterBottom>Banners</Typography>
                <Table>
                    <TableHead className="banner-table-header">
                        <TableRow
                            >
                            <TableCell>Imagen</TableCell>
                            <TableCell>Título</TableCell>
                            <TableCell>Ultima Actualización</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingBanners ? (
                            <TableRow
                                className="banner-table-row">
                                <TableCell colSpan={3} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : banners.map((banner: any) => (
                            <TableRow key={banner.id}           
                                className="banner-table-row">
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
                                            size="small"
                                        />
                                    ) : (
                                        banner.title
                                    )}
                                </TableCell>
                                <TableCell className="banner-table-cell">
                                    {banner.Fecha_Actualizacion
                                        ? new Date(banner.Fecha_Actualizacion).toLocaleString("es-CO", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
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
                                        <>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                size="small"
                                                className="banner-edit-image-button"
                                            >
                                                Cambiar Imagen
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={handleEditFileChange}
                                                />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="success"
                                                onClick={() => handleActualizar(banner.id)}
                                                disabled={loadingUpdateId === banner.id}
                                                className="banner-save-button"
                                            >
                                                {loadingUpdateId === banner.id ? "Actualizando..." : "Guardar"}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                onClick={cancelarEdicion}
                                            >
                                                Cancelar
                                            </Button>
                                        </>
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
                                                        onClick={() => setConfirmarEliminarId(banner.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Botón Activar */}
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleActivar(banner.id)}
                                                        disabled={loadingActivateId === banner.id}
                                                    >
                                                        {loadingActivateId === banner.id ? "Activando..." : "Activar"}
                                                    </Button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Confirmación de eliminar */}
                <Dialog
                    open={Boolean(confirmarEliminarId)}
                    onClose={() => setConfirmarEliminarId(null)}
                >
                    <DialogTitle className="banner-dialog-title">Confirmar eliminación</DialogTitle>
                    <DialogContent className="banner-dialog-content">
                        ¿Estás seguro que deseas eliminar este banner?
                    </DialogContent>
                    <DialogActions className="banner-dialog-actions">
                        <Button onClick={() => setConfirmarEliminarId(null)}>Cancelar</Button>
                        <Button
                            color="error"
                            onClick={handleEliminar}
                            disabled={loadingDeleteId === confirmarEliminarId}
                        >
                            {loadingDeleteId === confirmarEliminarId ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Modal >
    );
};

export default BannerUploadModal;
