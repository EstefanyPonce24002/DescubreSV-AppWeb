package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Transporte;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransporteResponse {

    private Long idTransporte;
    private String tipo;
    private BigDecimal costo;
    private Integer capacidad;
    private String tiempoEstimado;

    private Long idDestino;
    private String nombreDestino;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TransporteResponse fromEntity(Transporte transporte) {

        Long destinoId = null;
        String destinoNombre = null;

        if (transporte.getDestino() != null) {
            destinoId = transporte.getDestino().getIdDestino();
            destinoNombre = transporte.getDestino().getNombre();
        }

        return TransporteResponse.builder()
                .idTransporte(transporte.getIdTransporte())
                .tipo(transporte.getTipo())
                .costo(transporte.getCosto())
                .capacidad(transporte.getCapacidad())
                .tiempoEstimado(transporte.getTiempoEstimado())
                .idDestino(destinoId)
                .nombreDestino(destinoNombre)
                .activo(transporte.getActivo())
                .createdAt(transporte.getCreatedAt())
                .updatedAt(transporte.getUpdatedAt())
                .build();
    }
}