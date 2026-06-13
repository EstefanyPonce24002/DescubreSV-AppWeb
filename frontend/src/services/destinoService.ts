import api from './api';
import type { ApiResponse, PageResponse } from './categoriaService';

export interface DestinoRequest {
  nombre: string;
  descripcion?: string;
  departamento: string;
  precioEntrada?: number;
  horario?: string;
  mejorEpoca?: string;
  tipo?: string;
  comoLlegarVehiculo?: string;
  comoLlegarBus?: string;
  latitud?: number;
  longitud?: number;
  imagenUrl?: string;
  idCategoria: number;
  activo?: boolean;
}

export interface DestinoResponse {
  idDestino: number;
  nombre: string;
  descripcion?: string;
  departamento: string;
  precioEntrada: number;
  horario?: string;
  mejorEpoca?: string;
  tipo?: string;
  comoLlegarVehiculo?: string;
  comoLlegarBus?: string;
  latitud?: number;
  longitud?: number;
  imagenUrl?: string;
  calificacionPromedio: number;
  idCategoria: number;
  nombreCategoria: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export const destinoService = {
  listarAdmin: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<DestinoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<DestinoResponse>>>(
      `/api/admin/destinos?page=${page}&size=${size}&sort=idDestino,desc`
    );
    return response.data;
  },

  listarPublicos: async (page = 0, size = 10): Promise<ApiResponse<PageResponse<DestinoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<DestinoResponse>>>(
      `/api/destinos?page=${page}&size=${size}&sort=idDestino,desc`
    );
    return response.data;
  },

  obtenerPorId: async (id: number): Promise<ApiResponse<DestinoResponse>> => {
    const response = await api.get<ApiResponse<DestinoResponse>>(`/api/destinos/${id}`);
    return response.data;
  },

  listarPorCategoria: async (idCategoria: number, page = 0, size = 10): Promise<ApiResponse<PageResponse<DestinoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<DestinoResponse>>>(
      `/api/destinos/categoria/${idCategoria}?page=${page}&size=${size}`
    );
    return response.data;
  },

  listarPorDepartamento: async (departamento: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<DestinoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<DestinoResponse>>>(
      `/api/destinos/departamento/${encodeURIComponent(departamento)}?page=${page}&size=${size}`
    );
    return response.data;
  },

  buscarPorNombre: async (nombre: string, page = 0, size = 10): Promise<ApiResponse<PageResponse<DestinoResponse>>> => {
    const response = await api.get<ApiResponse<PageResponse<DestinoResponse>>>(
      `/api/destinos/buscar?nombre=${encodeURIComponent(nombre)}&page=${page}&size=${size}`
    );
    return response.data;
  },

  crear: async (data: DestinoRequest): Promise<ApiResponse<DestinoResponse>> => {
    const response = await api.post<ApiResponse<DestinoResponse>>('/api/admin/destinos', data);
    return response.data;
  },

  actualizar: async (id: number, data: DestinoRequest): Promise<ApiResponse<DestinoResponse>> => {
    const response = await api.put<ApiResponse<DestinoResponse>>(`/api/admin/destinos/${id}`, data);
    return response.data;
  },

  eliminar: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/api/admin/destinos/${id}`);
    return response.data;
  },
};
