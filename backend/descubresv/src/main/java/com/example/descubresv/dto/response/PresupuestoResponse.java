package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Presupuesto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Datos del presupuesto que se envian al cliente
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresupuestoResponse {

    private Long idPresupuesto;
    private Long idItinerario;
    private BigDecimal costoTransporte;
    private BigDecimal costoAlimentacion;
    private BigDecimal costoEntrada;
    private BigDecimal costoOtros;
    private BigDecimal total;
    private String moneda;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Convierte entidad a DTO
    public static PresupuestoResponse fromEntity(Presupuesto presupuesto) {
        return PresupuestoResponse.builder()
                .idPresupuesto(presupuesto.getIdPresupuesto())
                .idItinerario(presupuesto.getItinerario().getIdItinerario())
                .costoTransporte(presupuesto.getCostoTransporte())
                .costoAlimentacion(presupuesto.getCostoAlimentacion())
                .costoEntrada(presupuesto.getCostoEntrada())
                .costoOtros(presupuesto.getCostoOtros())
                .total(presupuesto.getTotal())
                .moneda(presupuesto.getMoneda())
                .createdAt(presupuesto.getCreatedAt())
                .updatedAt(presupuesto.getUpdatedAt())
                .build();
    }
}
