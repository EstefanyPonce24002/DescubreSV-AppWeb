package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.ItinerarioDestino;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItinerarioDestinoResponse {

    private Long idItinerario;
    private Long idDestino;
    private String nombreDestino;
    private Integer diaNumero;
    private Integer orden;
    private String notas;
    private DestinoResponse destino;

    public static ItinerarioDestinoResponse fromEntity(ItinerarioDestino itinerarioDestino) {
        if (itinerarioDestino == null) {
            return null;
        }

        DestinoResponse destinoResponse = null;
        String nombreDestino = null;
        if (itinerarioDestino.getDestino() != null) {
            destinoResponse = DestinoResponse.fromEntity(itinerarioDestino.getDestino());
            nombreDestino = itinerarioDestino.getDestino().getNombre();
        }

        return ItinerarioDestinoResponse.builder()
                .idItinerario(itinerarioDestino.getIdItinerario())
                .idDestino(itinerarioDestino.getIdDestino())
                .nombreDestino(nombreDestino)
                .diaNumero(itinerarioDestino.getDiaNumero())
                .orden(itinerarioDestino.getOrden())
                .notas(itinerarioDestino.getNotas())
                .destino(destinoResponse)
                .build();
    }
}
