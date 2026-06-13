package com.example.descubresv.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

// Datos para crear o actualizar un itinerario de viaje
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItinerarioRequest {

    @NotBlank(message = "El nombre del itinerario es obligatorio")
    @Size(max = 200, message = "El nombre no puede exceder 200 caracteres")
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer duracion;
    private String presupuestoCategoria;

    @Size(max = 100)
    private String tipoExperiencia;

    @Size(max = 100)
    private String tipoGrupo;

    @Size(max = 100)
    private String modoPlanificacion;
}
