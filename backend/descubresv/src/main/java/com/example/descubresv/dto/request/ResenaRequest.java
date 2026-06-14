package com.example.descubresv.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Datos para crear una resena sobre un destino
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResenaRequest {

    // Identificador del destino que sera evaluado en la resena.
    @NotNull(message = "El id del destino es obligatorio")
    private Long idDestino;

    // Calificacion numerica obligatoria con rango valido de 1 a 5.
    @NotNull(message = "La calificacion es obligatoria")
    @Min(value = 1, message = "La calificacion minima es 1")
    @Max(value = 5, message = "La calificacion maxima es 5")
    private Integer calificacion;

    // Comentario opcional para describir la experiencia del usuario.
    private String comentario;
}
