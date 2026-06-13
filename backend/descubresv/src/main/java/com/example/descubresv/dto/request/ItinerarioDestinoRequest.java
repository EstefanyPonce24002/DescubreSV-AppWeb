package com.example.descubresv.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItinerarioDestinoRequest {

    @NotNull(message = "El id del destino es obligatorio")
    private Long idDestino;

    @NotNull(message = "El numero de dia es obligatorio")
    private Integer diaNumero;

    @NotNull(message = "El orden es obligatorio")
    private Integer orden;

    private String notas;
}
