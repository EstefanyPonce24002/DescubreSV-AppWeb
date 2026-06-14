package com.example.descubresv.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransporteRequest {

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;

    private BigDecimal costo;

    private Integer capacidad;

    private String tiempoEstimado;

    @NotNull(message = "El destino es obligatorio")
    private Long idDestino;

    private Boolean activo;
}