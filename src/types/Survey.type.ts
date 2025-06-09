export interface SurveyResult {
  _id: string;
  tipoIdentificacion: string;
  identificacion: string;
  nombre: string;
  findrisc: number | null;
  framingham: number | null;
  lawtonBrody: number | null;
  moriskyGreen?: number | null;
  fecha: string;
}

export type Agrupado = {
  tipoIdentificacion: string;
  identificacion: string;
  nombre: string;
  fecha: string;
  findrisc: number | null;
  framingham: number | null;
  lawtonBrody: number | null;
  moriskyGreen?: number | null;
};

