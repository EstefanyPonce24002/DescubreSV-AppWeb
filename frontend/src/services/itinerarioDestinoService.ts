import api from './api';
import type { ApiResponse } from './categoriaService';
import type { DestinoResponse } from './destinoService';

export interface ItinerarioDestinoRequest {
  idItinerario: number;
  idDestino: number;
  diaNumero: number;
  orden: number;
  notas?: string;
}

export interface ItinerarioDestinoResponse {
  idItinerario: number;
  idDestino: number;
  destino?: DestinoResponse; // Asumiendo que tu backend devuelve los datos del destino
  diaNumero: number;
  orden: number;
  notas: string;
}

export const itinerarioDestinoService = {
  obtenerPorItinerario: async (idItinerario: number): Promise<ApiResponse<ItinerarioDestinoResponse[]>> => {
    const response = await api.get<ApiResponse<ItinerarioDestinoResponse[]>>(`/api/itinerario-destinos/itinerario/${idItinerario}`);
    return response.data;
  },

  agregarDestino: async (data: ItinerarioDestinoRequest): Promise<ApiResponse<ItinerarioDestinoResponse>> => {
    const response = await api.post<ApiResponse<ItinerarioDestinoResponse>>('/api/itinerario-destinos', data);
    return response.data;
  },

  // Nota: Como la llave primaria es compuesta en SQL, el endpoint de eliminar en Spring Boot 
  // suele requerir ambos IDs para saber exactamente qué registro borrar.
  eliminarDestino: async (idItinerario: number, idDestino: number): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/api/itinerario-destinos/${idItinerario}/${idDestino}`);
    return response.data;
  }
};