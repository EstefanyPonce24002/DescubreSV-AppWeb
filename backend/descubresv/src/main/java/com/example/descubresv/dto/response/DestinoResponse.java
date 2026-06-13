package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Destino;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DestinoResponse {

    private Long idDestino;
    private String nombre;
    private String descripcion;
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
    private BigDecimal calificacionPromedio;
    private Long idCategoria;
    private String nombreCategoria;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static DestinoResponse fromEntity(Destino destino) {
        Long catId = null;
        String catName = null;
        if (destino.getCategoria() != null) {
            catId = destino.getCategoria().getIdCategoria();
            catName = destino.getCategoria().getNombreCategoria();
        }
        return DestinoResponse.builder()
                .idDestino(destino.getIdDestino())
                .nombre(destino.getNombre())
                .descripcion(destino.getDescripcion())
                .departamento(destino.getDepartamento())
                .precioEntrada(destino.getPrecioEntrada())
                .horario(destino.getHorario())
                .mejorEpoca(destino.getMejorEpoca())
                .tipo(destino.getTipo())
                .comoLlegarVehiculo(destino.getComoLlegarVehiculo())
                .comoLlegarBus(destino.getComoLlegarBus())
                .latitud(destino.getLatitud())
                .longitud(destino.getLongitud())
                .imagenUrl(destino.getImagenUrl())
                .calificacionPromedio(destino.getCalificacionPromedio())
                .idCategoria(catId)
                .nombreCategoria(catName)
                .activo(destino.getActivo())
                .createdAt(destino.getCreatedAt())
                .updatedAt(destino.getUpdatedAt())
                .build();
    }
}
