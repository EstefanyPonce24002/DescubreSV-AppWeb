package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "destinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_destino")
    private Long idDestino;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 100)
    private String departamento;

    @Column(name = "precio_entrada", precision = 10, scale = 2)
    private BigDecimal precioEntrada;

    @Column(length = 200)
    private String horario;

    @Column(name = "mejor_epoca", length = 200)
    private String mejorEpoca;

    @Column(length = 100)
    private String tipo;

    @Column(name = "como_llegar_vehiculo", columnDefinition = "TEXT")
    private String comoLlegarVehiculo;

    @Column(name = "como_llegar_bus", columnDefinition = "TEXT")
    private String comoLlegarBus;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitud;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitud;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "calificacion_promedio", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal calificacionPromedio = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria")
    private CategoriaDestino categoria;

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
