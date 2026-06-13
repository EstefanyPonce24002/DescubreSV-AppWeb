package com.example.descubresv.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// Datos para crear o actualizar el presupuesto de un itinerario
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoRequest {

    // Monto estimado para transporte (combustible, pasajes, traslados internos).
    private BigDecimal costoTransporte;

    // Monto estimado para alimentacion durante el viaje.
    private BigDecimal costoAlimentacion;

    // Monto estimado para entradas a destinos, parques o actividades.
    private BigDecimal costoEntrada;

    // Monto estimado para gastos adicionales no contemplados en otras categorias.
    private BigDecimal costoOtros;
}
