package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// Entidad itinerario destino - relacion muchos a muchos con orden y dia
@Entity
@Table(name = "itinerario_destinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ItinerarioDestinoId.class)
public class ItinerarioDestino {

    // Parte 1 de la clave primaria compuesta: referencia al itinerario propietario.
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_itinerario")
    private Itinerario itinerario;

    // Parte 2 de la clave primaria compuesta: destino agregado al itinerario.
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destino")
    private Destino destino;

    // Dia del viaje en el que se planifica visitar este destino.
    @Column(name = "dia_numero", nullable = false)
    @Builder.Default
    private Integer diaNumero = 1;

    // Orden de visita dentro del mismo dia para organizar la ruta.
    @Column(nullable = false)
    @Builder.Default
    private Integer orden = 1;

    // Observaciones o recomendaciones personalizadas para esta parada.
    @Column(columnDefinition = "TEXT")
    private String notas;

    // Fecha y hora de creacion del registro, asignada automaticamente.
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
