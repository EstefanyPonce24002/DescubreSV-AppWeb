import api from './api';
import type { ApiResponse, PageResponse } from './categoriaService';

export interface ItinerarioRequest {
  idUsuario: number;
  nombre: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracion?: number;
  presupuestoCategoria?: string;
  tipoExperiencia?: string;
  tipoGrupo?: string;
  modoPlanificacion?: string;
  activo?: boolean;
}

export interface ItinerarioResponse {
  idItinerario: number;
  usuarioId: number;
  nombreUsuario?: string;
  nombre: string;
  fechaInicio?: string;
  fechaFin?: string;
  duracion?: number;
  presupuestoCategoria?: string;
  tipoExperiencia?: string;
  tipoGrupo?: string;
  modoPlanificacion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const itinerarioService = {
  listarTodos: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<ItinerarioResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<ItinerarioResponse>>>(
      `/api/itinerarios?page=${page}&size=${size}&sort=idItinerario,desc`
    );
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<ApiResponse<ItinerarioResponse>> => {
    const response = await api.get<ApiResponse<ItinerarioResponse>>(`/api/itinerarios/${id}`);
    return response.data;
  },

  crear: async (data: ItinerarioRequest): Promise<ApiResponse<ItinerarioResponse>> => {
    const response = await api.post<ApiResponse<ItinerarioResponse>>('/api/itinerarios', data);
    return response.data;
  },

  actualizar: async (id: number, data: ItinerarioRequest): Promise<ApiResponse<ItinerarioResponse>> => {
    const response = await api.put<ApiResponse<ItinerarioResponse>>(`/api/itinerarios/${id}`, data);
    return response.data;
  },

  eliminar: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/api/itinerarios/${id}`);
    return response.data;
  }
};