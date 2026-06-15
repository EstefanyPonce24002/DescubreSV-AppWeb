package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Itinerario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

// Datos del itinerario que se envian al cliente con destinos incluidos
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItinerarioResponse {

    private Long idItinerario;
    private Long usuarioId;
    private String nombreUsuario;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer duracion;
    private String presupuestoCategoria;
    private String tipoExperiencia;
    private String tipoGrupo;
    private String modoPlanificacion;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ItinerarioDestinoResponse> destinos;

    // Convierte entidad a DTO sin la lista de destinos
    public static ItinerarioResponse fromEntity(Itinerario itinerario) {
        return ItinerarioResponse.builder()
                .idItinerario(itinerario.getIdItinerario())
                .usuarioId(itinerario.getUsuario() != null ? itinerario.getUsuario().getIdUsuario() : null)
                .nombreUsuario(itinerario.getUsuario() != null ? itinerario.getUsuario().getNombre() : null)
                .nombre(itinerario.getNombre())
                .fechaInicio(itinerario.getFechaInicio())
                .fechaFin(itinerario.getFechaFin())
                .duracion(itinerario.getDuracion())
                .presupuestoCategoria(itinerario.getPresupuestoCategoria())
                .tipoExperiencia(itinerario.getTipoExperiencia())
                .tipoGrupo(itinerario.getTipoGrupo())
                .modoPlanificacion(itinerario.getModoPlanificacion())
                .activo(itinerario.getActivo())
                .createdAt(itinerario.getCreatedAt())
                .updatedAt(itinerario.getUpdatedAt())
                .build();
    }

    // Convierte entidad a DTO con la lista de destinos incluida
    public static ItinerarioResponse fromEntityConDestinos(Itinerario itinerario,
            List<ItinerarioDestinoResponse> destinos) {
        ItinerarioResponse response = fromEntity(itinerario);
        response.setDestinos(destinos);
        return response;
    }
}
