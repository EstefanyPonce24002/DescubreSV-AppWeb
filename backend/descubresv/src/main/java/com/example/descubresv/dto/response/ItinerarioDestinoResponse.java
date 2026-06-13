package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.ItinerarioDestino;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Datos de un destino dentro de un itinerario
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItinerarioDestinoResponse {

    private Long idDestino;
    private String nombreDestino;
    private String departamento;
    private Integer diaNumero;
    private Integer orden;
    private String notas;

    // Convierte entidad a DTO con datos basicos del destino
    public static ItinerarioDestinoResponse fromEntity(ItinerarioDestino id) {
        return ItinerarioDestinoResponse.builder()
                .idDestino(id.getDestino().getIdDestino())
                .nombreDestino(id.getDestino().getNombre())
                .departamento(id.getDestino().getDepartamento())
                .diaNumero(id.getDiaNumero())
                .orden(id.getOrden())
                .notas(id.getNotas())
                .build();
    }
}
