package com.example.descubresv.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Datos para agregar un destino a un itinerario con dia y orden
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItinerarioDestinoRequest {

    @NotNull(message = "El id del destino es obligatorio")
    private Long idDestino;

    @Min(value = 1, message = "El dia debe ser al menos 1")
    private Integer diaNumero = 1;

    @Min(value = 1, message = "El orden debe ser al menos 1")
    private Integer orden = 1;

    private String notas;
}
