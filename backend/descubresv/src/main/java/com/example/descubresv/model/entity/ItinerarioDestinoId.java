package com.example.descubresv.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItinerarioDestinoId implements Serializable {
    private Long idItinerario;
    private Long idDestino;
}
