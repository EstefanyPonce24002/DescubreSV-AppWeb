import api from './api';
import type { ApiResponse, PageResponse } from './categoriaService';

export interface ResenaRequest {
  idDestino: number;
  calificacion: number;
  comentario?: string;
}

export interface ResenaResponse {
  idResena: number;
  idUsuario: number;
  nombreUsuario: string;
  idDestino: number;
  nombreDestino: string;
  calificacion: number;
  comentario: string;
  createdAt: string;
}

export const resenaService = {
  listarPorDestino: async (idDestino: number, page = 0, size = 10): Promise<ApiResponse<PageResponse<ResenaResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<ResenaResponse>>>(
      `/api/destinos/${idDestino}/resenas?page=${page}&size=${size}&sort=idResena,desc`
    );
    return response.data;
  },

  crear: async (data: ResenaRequest): Promise<ApiResponse<ResenaResponse>> => {
    const response = await api.post<ApiResponse<ResenaResponse>>('/api/turista/resenas', data);
    return response.data;
  },

  listarMisResenas: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<ResenaResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<ResenaResponse>>>(
      `/api/turista/resenas?page=${page}&size=${size}&sort=idResena,desc`
    );
    return response.data;
  },

  eliminar: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(`/api/turista/resenas/${id}`);
    return response.data;
  }
};
