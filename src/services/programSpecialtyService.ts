import axios from "axios";
import { getToken } from "./authService";

const API_URL = "https://backend.bienestarips.com/maestros/programSpecialty";

export const getProgramSpecialties = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createProgramSpecialty = async (program: string, specialties: string[]) => {
  const token = getToken();

  // Generar keywords automáticamente
  const keywords = generateKeywords(program);

  const response = await axios.post(API_URL, {
    program,
    keywords,
    specialties
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
};

export const updateProgramSpecialty = async (id: string, program: string, specialties: string[]) => {
  const token = getToken();

  const keywords = generateKeywords(program);

  const response = await axios.put(`${API_URL}/${id}`, {
    program,
    keywords,
    specialties
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data;
};

// Helper para generar keywords
export const generateKeywords = (program: string): string[] => {
  const baseKeywords = program.toLowerCase().split(" ");
  const extras = [
    program.toLowerCase(),
    program.toLowerCase().replace(/[áéíóú]/g, (c: string) => {
      return { á: "a", é: "e", í: "i", ó: "o", ú: "u" }[c as "á" | "é" | "í" | "ó" | "ú"];
    })
  ];
  return [...new Set([...baseKeywords, ...extras])];
};

export const deleteProgramSpecialty = async (id: string) => {
  const token = getToken();
  const response = await axios.delete(
    `${API_URL}/delete/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
