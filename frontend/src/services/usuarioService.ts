import api from './api';
import type { ApiResponse } from './authService';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  nacionalidad?: string;
  presupuestoEstimado?: number;
  rol: 'ADMIN' | 'TURISTA';
  activo: boolean;
  createdAt: string;
}

export interface UsuarioPage {
  contenido: Usuario[];
  paginaActual: number;
  tamanoPagina: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
}

export interface UsuarioRequest {
  nombre: string;
  correo: string;
  password?: string;
  nacionalidad?: string;
  preferencias?: string;
  presupuestoEstimado?: number;
  rol: 'ADMIN' | 'TURISTA';
  activo?: boolean;
}

export const usuarioService = {
  listar: async (page: number = 0, size: number = 10): Promise<ApiResponse<UsuarioPage>> => {
    const response = await api.get<ApiResponse<UsuarioPage>>(`/api/admin/usuarios?page=${page}&size=${size}`);
    return response.data;
  },

  buscarPorId: async (id: number): Promise<ApiResponse<Usuario>> => {
    const response = await api.get<ApiResponse<Usuario>>(`/api/admin/usuarios/${id}`);
    return response.data;
  },

  crear: async (request: UsuarioRequest): Promise<ApiResponse<Usuario>> => {
    const response = await api.post<ApiResponse<Usuario>>('/api/admin/usuarios', request);
    return response.data;
  },

  actualizar: async (id: number, request: UsuarioRequest): Promise<ApiResponse<Usuario>> => {
    const response = await api.put<ApiResponse<Usuario>>(`/api/admin/usuarios/${id}`, request);
    return response.data;
  },

  eliminar: async (id: number): Promise<ApiResponse<string>> => {
    const response = await api.delete<ApiResponse<string>>(`/api/admin/usuarios/${id}`);
    return response.data;
  }
};
