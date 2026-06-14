import api from './api';
import type { ApiResponse } from './categoriaService';

export interface PresupuestoRequest {
  idItinerario: number;
  costoTransporte?: number;
  costoAlimentacion?: number;
  costoEntrada?: number;
  costoOtros?: number;
  moneda?: string;
}

export interface PresupuestoResponse {
  idPresupuesto: number;
  idItinerario: number;
  costoTransporte: number;
  costoAlimentacion: number;
  costoEntrada: number;
  costoOtros: number;
  total: number;
  moneda: string;
}

export const presupuestoService = {
  obtenerPorItinerario: async (idItinerario: number): Promise<ApiResponse<PresupuestoResponse>> => {
    const response = await api.get<ApiResponse<PresupuestoResponse>>(`/api/presupuestos/itinerario/${idItinerario}`);
    return response.data;
  },

  guardar: async (data: PresupuestoRequest): Promise<ApiResponse<PresupuestoResponse>> => {
    const response = await api.post<ApiResponse<PresupuestoResponse>>('/api/presupuestos', data);
    return response.data;
  },

  actualizar: async (id: number, data: PresupuestoRequest): Promise<ApiResponse<PresupuestoResponse>> => {
    const response = await api.put<ApiResponse<PresupuestoResponse>>(`/api/presupuestos/${id}`, data);
    return response.data;
  }
};