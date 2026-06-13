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
public class DestinoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 200, message = "El nombre debe tener entre 2 y 200 caracteres")
    private String nombre;

    private String descripcion;

    @NotBlank(message = "El departamento es obligatorio")
    @Size(min = 2, max = 100, message = "El departamento debe tener entre 2 y 100 caracteres")
    private String departamento;

    private BigDecimal precioEntrada;

    private String horario;

    private String mejorEpoca;

    private String tipo;

    private String comoLlegarVehiculo;

    private String comoLlegarBus;

    private BigDecimal latitud;

    private BigDecimal longitud;

    private String imagenUrl;

    @NotNull(message = "La categoria es obligatoria")
    private Long idCategoria;

    private Boolean activo;
}
