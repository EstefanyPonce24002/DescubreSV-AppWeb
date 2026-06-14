package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alimentacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alimentacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alimentacion")
    private Long idAlimentacion;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "tipo_comida", length = 100)
    private String tipoComida;

    @Column(name = "precio_promedio", precision = 10, scale = 2)
    private BigDecimal precioPromedio;

    @Column(length = 200)
    private String ubicacion;

    @Column(length = 200)
    private String horario;

    private Integer calificacion;

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