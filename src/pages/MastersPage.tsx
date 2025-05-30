import { useState } from "react";
import { Button, Box, Typography, Stack, Paper, Divider } from "@mui/material";
import BannerUploadModal from "../components/BannerUploadModal";
import UserManagementModal from "../components/UserManagementModal";
import ProgramSpecialtyModal from "../components/ProgramSpecialtyModal";

const MastersPage = () => {
    const [modalBannersAbierto, setModalBannersAbierto] = useState(false);
    const [modalUsuariosAbierto, setModalUsuariosAbierto] = useState(false);
    const [modalProgramasAbierto, setModalProgramasAbierto] = useState(false);

    return (
        <Box mt={5} mx="auto" maxWidth={1000}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Maestros
                </Typography>

                <text aria-atomic>
                    Control de Usuarios HG y Componentes de la Aplicación Movil CuidarMe
                </text>

                <Divider sx={{ mb: 3 }} />

                <Stack direction="row" spacing={3} mb={4}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setModalBannersAbierto(true)}
                        sx={{backgroundColor: "var(--primary)", color:"var(--white)"}}
                    >
                        Banners
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setModalUsuariosAbierto(true)}
                        sx={{backgroundColor: "var(--primary)", color:"var(--white)"}}
                    >
                        Usuarios
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setModalProgramasAbierto(true)}
                        sx={{backgroundColor: "var(--primary)", color:"var(--white)"}}
                    >
                        Programas
                    </Button>
                </Stack>

                {/* Modals */}
                <BannerUploadModal
                    open={modalBannersAbierto}
                    onClose={() => setModalBannersAbierto(false)}
                />

                <UserManagementModal
                    open={modalUsuariosAbierto}
                    onClose={() => setModalUsuariosAbierto(false)}
                />

                <ProgramSpecialtyModal
                    open={modalProgramasAbierto}
                    onClose={() => setModalProgramasAbierto(false)}
                />
            </Paper>
        </Box>
    );
};

export default MastersPage;
