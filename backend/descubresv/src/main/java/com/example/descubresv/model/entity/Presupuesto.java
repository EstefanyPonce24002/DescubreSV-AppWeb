package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entidad presupuesto - desglose de costos por itinerario
@Entity
@Table(name = "presupuesto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Presupuesto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_presupuesto")
    private Long idPresupuesto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_itinerario", nullable = false)
    private Itinerario itinerario;

    @Column(name = "costo_transporte", precision = 10, scale = 2)
    private BigDecimal costoTransporte;

    @Column(name = "costo_alimentacion", precision = 10, scale = 2)
    private BigDecimal costoAlimentacion;

    @Column(name = "costo_entrada", precision = 10, scale = 2)
    private BigDecimal costoEntrada;

    @Column(name = "costo_otros", precision = 10, scale = 2)
    private BigDecimal costoOtros;

    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String moneda = "USD";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
