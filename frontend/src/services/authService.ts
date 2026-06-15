import api from './api';

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  nacionalidad?: string;
  preferencias?: string;
  presupuestoEstimado?: number;
  avatarUrl?: string;
}

export interface AuthResponse {
  idUsuario: number;
  nombre: string;
  correo: string;
  avatarUrl: string | null;
  rol: 'ADMIN' | 'TURISTA';
  token?: string;
  nacionalidad?: string;
  preferencias?: string;
  presupuestoEstimado?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export const authService = {
  login: async (request: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', request);
    return response.data;
  },

  register: async (request: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', request);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/api/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.get<ApiResponse<AuthResponse>>('/api/auth/me');
    return response.data;
  }
};
