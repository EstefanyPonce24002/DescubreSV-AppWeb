package com.example.descubresv.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlimentacionRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El tipo de comida es obligatorio")
    @Size(min = 2, max = 100, message = "El tipo de comida debe tener entre 2 y 100 caracteres")
    private String tipoComida;

    private BigDecimal precioPromedio;

    private String ubicacion;

    private String horario;

    private Integer calificacion;

    @NotNull(message = "El destino es obligatorio")
    private Long idDestino;

    private Boolean activo;
}