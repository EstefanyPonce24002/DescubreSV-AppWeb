import api from './api';

export interface CategoriaRequest {
  nombreCategoria: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CategoriaResponse {
  idCategoria: number;
  nombreCategoria: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  contenido: T[];
  paginaActual: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const categoriaService = {
  listarAdmin: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<CategoriaResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<CategoriaResponse>>>(
      `/api/admin/categorias?page=${page}&size=${size}&sort=idCategoria,desc`
    );
    return response.data;
  },

  listarPublicas: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<CategoriaResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<CategoriaResponse>>>(
      `/api/categorias?page=${page}&size=${size}&sort=idCategoria,desc`
    );
    return response.data;
  },

  listarActivasSinPaginar: async (): Promise<ApiResponse<CategoriaResponse[]>> => {
    const response = await api.get<ApiResponse<CategoriaResponse[]>>('/api/categorias/list');
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<ApiResponse<CategoriaResponse>> => {
    const response = await api.get<ApiResponse<CategoriaResponse>>(`/api/admin/categorias/${id}`);
    return response.data;
  },

  crear: async (data: CategoriaRequest): Promise<ApiResponse<CategoriaResponse>> => {
    const response = await api.post<ApiResponse<CategoriaResponse>>('/api/admin/categorias', data);
    return response.data;
  },

  actualizar: async (id: number, data: CategoriaRequest): Promise<ApiResponse<CategoriaResponse>> => {
    const response = await api.put<ApiResponse<CategoriaResponse>>(`/api/admin/categorias/${id}`, data);
    return response.data;
  },

  eliminar: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/api/admin/categorias/${id}`);
    return response.data;
  },
};
