package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transporte")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transporte")
    private Long idTransporte;

    @Column(nullable = false, length = 100)
    private String tipo;

    @Column(precision = 10, scale = 2)
    private BigDecimal costo;

    private Integer capacidad;

    @Column(name = "tiempo_estimado", length = 50)
    private String tiempoEstimado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destino")
    private Destino destino;

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