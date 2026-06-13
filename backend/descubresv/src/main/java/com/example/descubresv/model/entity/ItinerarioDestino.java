package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "itinerario_destinos")
@IdClass(ItinerarioDestinoId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItinerarioDestino {

    @Id
    private Long idItinerario;

    @Id
    private Long idDestino;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idItinerario")
    @JoinColumn(name = "id_itinerario")
    private Itinerario itinerario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idDestino")
    @JoinColumn(name = "id_destino")
    private Destino destino;

    @Column(name = "dia_numero", nullable = false)
    private Integer diaNumero;

    @Column(nullable = false)
    private Integer orden;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
