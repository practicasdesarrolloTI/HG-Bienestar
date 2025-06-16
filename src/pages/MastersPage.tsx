import { useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import BannerUploadModal from "../components/BannerUploadModal";
import UserManagementModal from "../components/UserManagementModal";
import ProgramSpecialtyModal from "../components/ProgramSpecialtyModal";
import "../styles/MastersPage.css";

const MastersPage = () => {
  const [modalBannersAbierto, setModalBannersAbierto] = useState(false);
  const [modalUsuariosAbierto, setModalUsuariosAbierto] = useState(false);
  const [modalProgramasAbierto, setModalProgramasAbierto] = useState(false);

  return (
  
      <Box >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Maestros
          </Typography>

          <text aria-atomic>
            Control de Usuarios HG y Componentes de la Aplicación Movil CuidarMe
          </text>

          <Divider sx={{ mb: 3, mt:3 }} />

          <div className="button-container">
            <button
              onClick={() => setModalBannersAbierto(true)}
              className="btn btn-outline"
            >
              Banners
            </button>

            <button
              onClick={() => setModalUsuariosAbierto(true)}
              className="btn btn-outline"
            >
              Usuarios
            </button>

            <button
              onClick={() => setModalProgramasAbierto(true)}
              className="btn btn-outline"
            >
              Programas
            </button>
          </div>

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
