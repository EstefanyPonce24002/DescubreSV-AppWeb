package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Alimentacion;
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
public class AlimentacionResponse {

    private Long idAlimentacion;
    private String nombre;
    private String tipoComida;
    private BigDecimal precioPromedio;
    private String ubicacion;
    private String horario;
    private Integer calificacion;

    private Long idDestino;
    private String nombreDestino;

    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AlimentacionResponse fromEntity(Alimentacion alimentacion) {

        Long destinoId = null;
        String destinoNombre = null;

        if (alimentacion.getDestino() != null) {
            destinoId = alimentacion.getDestino().getIdDestino();
            destinoNombre = alimentacion.getDestino().getNombre();
        }

        return AlimentacionResponse.builder()
                .idAlimentacion(alimentacion.getIdAlimentacion())
                .nombre(alimentacion.getNombre())
                .tipoComida(alimentacion.getTipoComida())
                .precioPromedio(alimentacion.getPrecioPromedio())
                .ubicacion(alimentacion.getUbicacion())
                .horario(alimentacion.getHorario())
                .calificacion(alimentacion.getCalificacion())
                .idDestino(destinoId)
                .nombreDestino(destinoNombre)
                .activo(alimentacion.getActivo())
                .createdAt(alimentacion.getCreatedAt())
                .updatedAt(alimentacion.getUpdatedAt())
                .build();
    }
}