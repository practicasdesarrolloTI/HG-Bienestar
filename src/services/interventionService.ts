import axios from "axios";
import { getToken } from "./authService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export const registrarIntervencion = async (
  pacienteTipo: string,
  pacienteNumero: string,
  pacienteNombre: string,
  detalles: string,
  realizadaPor: string,
  fechaEncuesta: string
) => {
  const token = getToken();
  const response = await axios.post(
    `${API_URL}/intervenciones`,
    {
      pacienteTipo,
      pacienteNumero,
      pacienteNombre,
      detalles,
      realizadaPor,
      fechaEncuesta
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
