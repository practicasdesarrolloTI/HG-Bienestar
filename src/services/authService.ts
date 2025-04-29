import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

interface DecodedToken {
  exp: number;
  username: string;
  userId: string;
}

export const registerUser = async (username: string, mail: string, password: string, role: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, mail, password, role });
  return response.data;
};

interface LoginResponse {
  token: string;
  username: string;
  userId: string;
}

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, { username, password });

  // Guarda token en localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify({
    username: response.data.username,
    userId: response.data.userId
  }));

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      logoutUser(); // 🔴 Token expirado → desloguear
      return null;
    }

    return token;
  } catch (err) {
    logoutUser(); // 🔴 Token inválido → desloguear
    return null;
  }
};

export const getCurrentUser = (): { username: string; userId: string } | null => {
  const token = getToken(); // <- ya valida expiración también
  const user = localStorage.getItem("user");

  return token && user ? JSON.parse(user) : null;
};
