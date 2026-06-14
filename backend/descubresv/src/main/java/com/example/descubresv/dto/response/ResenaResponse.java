package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Resena;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Datos de la resena que se envian al cliente
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResenaResponse {

    private Long idResena;
    private Long idUsuario;
    private String nombreUsuario;
    private Long idDestino;
    private String nombreDestino;
    private Integer calificacion;
    private String comentario;
    private LocalDateTime createdAt;

    // Convierte entidad a DTO, incluye nombre del usuario y destino
    public static ResenaResponse fromEntity(Resena resena) {
        return ResenaResponse.builder()
                .idResena(resena.getIdResena())
                .idUsuario(resena.getUsuario().getIdUsuario())
                .nombreUsuario(resena.getUsuario().getNombre())
                .idDestino(resena.getDestino().getIdDestino())
                .nombreDestino(resena.getDestino().getNombre())
                .calificacion(resena.getCalificacion())
                .comentario(resena.getComentario())
                .createdAt(resena.getCreatedAt())
                .build();
    }
}
