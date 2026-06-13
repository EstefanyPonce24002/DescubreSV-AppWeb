package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.CategoriaDestino;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaResponse {

    private Long idCategoria;
    private String nombreCategoria;
    private String descripcion;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CategoriaResponse fromEntity(CategoriaDestino categoria) {
        return CategoriaResponse.builder()
                .idCategoria(categoria.getIdCategoria())
                .nombreCategoria(categoria.getNombreCategoria())
                .descripcion(categoria.getDescripcion())
                .activo(categoria.getActivo())
                .createdAt(categoria.getCreatedAt())
                .updatedAt(categoria.getUpdatedAt())
                .build();
    }
}
