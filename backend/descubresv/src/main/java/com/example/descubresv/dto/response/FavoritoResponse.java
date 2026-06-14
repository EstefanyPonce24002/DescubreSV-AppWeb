package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Favorito;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoritoResponse {

    private Long idFavorito;
    private Long idUsuario;
    private String nombreUsuario;
    private Long idDestino;
    private String nombreDestino;
    private LocalDateTime createdAt;

    public static FavoritoResponse fromEntity(Favorito favorito) {
        return FavoritoResponse.builder()
                .idFavorito(favorito.getIdFavorito())
                .idUsuario(favorito.getUsuario().getIdUsuario())
                .nombreUsuario(favorito.getUsuario().getNombre())
                .idDestino(favorito.getDestino().getIdDestino())
                .nombreDestino(favorito.getDestino().getNombre())
                .createdAt(favorito.getCreatedAt())
                .build();
    }
}