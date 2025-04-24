import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export const registerUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
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

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
