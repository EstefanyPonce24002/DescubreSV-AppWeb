package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

//import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Entidad itinerario - Planificación de viajes
@Entity
@Table(name = "itinerarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Itinerario {

    // Identificador unico autogenerado para cada itinerario.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_itinerario")
    private Long idItinerario;

    // Relacion muchos-a-uno: cada itinerario pertenece a un usuario.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Nombre descriptivo del plan de viaje.
    @Column(nullable = false, length = 200)
    private String nombre;

    // Fecha de inicio estimada del itinerario.
    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    // Fecha de finalizacion estimada del itinerario.
    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    // Duracion total del viaje (normalmente expresada en dias).
    @Column
    private Integer duracion;

    // Categoria de presupuesto esperada para el viaje.
    // Económico, Moderado, Lujo
    @Column(name = "presupuesto_categoria")
    private String presupuestoCategoria;

    // Tipo de experiencia que el usuario desea
    // Aventura, relax, cultural, etc.).
    @Column(name = "tipo_experiencia", length = 100)
    private String tipoExperiencia;

    // Composicion del grupo viajero para ajustar recomendaciones.
    // Solo, Pareja, Grupo_pequeño, Grupo_grande
    @Column(name = "tipo_grupo", length = 100)
    private String tipoGrupo;

    // Modo en que se genero o construyo el itinerario:
    // Manual, automatico
    @Column(name = "modo_planificacion", length = 100)
    private String modoPlanificacion;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
