import axios from "axios";
import { getToken } from "./authService";
import { Intervencion } from "../types/Intervenciones.type";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api/intervenciones";

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
    `${API_URL}/Upload`,
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

export const getIntervenciones = async (): Promise<Intervencion[]> => {
  const response = await axios.get<Intervencion[]>(`${API_URL}/GetAll`);
  console.log("Intervenciones obtenidas:", response.data);
  return response.data;
};

export const cerrarCasoIntervenciones = async (pacienteTipo: string, pacienteNumero: string) => {
  const response = await axios.put(`${API_URL}/Close`, {
    pacienteTipo,
    pacienteNumero
  });
  return response.data;
};

