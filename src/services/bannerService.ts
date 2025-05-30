import axios from "axios";
import { getToken } from "./authService";

const API_URL = "https://backend.bienestarips.com/maestros/banners";

export const subirBanner = async (title: string, imageFile: File) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", imageFile);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // si tu API requiere auth, si no, puedes quitar esta línea
    },
  });

  return response.data;
};

export const obtenerBanners = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/All`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const actualizarBanner = async (id: string, title: string, imageFile?: File) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("title", title);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await axios.put(`${API_URL}/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const eliminarBanner = async (id: string) => {
  const token = getToken();
  const response = await axios.patch(`${API_URL}/desactivate/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const activarBanner = async (id: string) => {
  const token = getToken();
  const response = await axios.patch(
    `https://backend.bienestarips.com/maestros/banners/activate/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};
