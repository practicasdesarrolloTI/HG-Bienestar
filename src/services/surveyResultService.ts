import axios from "axios";
import { getToken } from "./authService";
import { SurveyResult } from "../types/Survey.type";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";

export const getSurveyResults = async (): Promise<SurveyResult[]> => {
  const token = getToken();
  const response = await axios.get<SurveyResult[]>(`${API_URL}/survey-results`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
