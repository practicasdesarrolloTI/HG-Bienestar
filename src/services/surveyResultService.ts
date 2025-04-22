import axios from "axios";
import { SurveyResult } from "../types/Survey.type";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getSurveyResults = async (): Promise<SurveyResult[]> => {
  const response = await axios.get<SurveyResult[]>(`${API_URL}/survey-results`);
  return response.data;
};
