import api from './api';
import type { ApiResponse, PageResponse } from './categoriaService';

export interface FavoritoRequest {
  idDestino: number;
}

export interface FavoritoResponse {
  idFavorito: number;
  idUsuario: number;
  nombreUsuario: string;
  idDestino: number;
  nombreDestino: string;
  createdAt: string;
}

export const favoritoService = {
  listarMisFavoritos: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<FavoritoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<FavoritoResponse>>>(
      `/api/turista/favoritos?page=${page}&size=${size}&sort=idFavorito,desc`
    );
    return response.data;
  },

  agregar: async (data: FavoritoRequest): Promise<ApiResponse<FavoritoResponse>> => {
    const response = await api.post<ApiResponse<FavoritoResponse>>('/api/turista/favoritos', data);
    return response.data;
  },

  eliminar: async (idFavorito: number): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(`/api/turista/favoritos/${idFavorito}`);
    return response.data;
  }
};
