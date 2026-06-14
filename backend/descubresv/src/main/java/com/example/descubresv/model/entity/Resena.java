package com.example.descubresv.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// Entidad resena - calificaciones y comentarios de turistas
@Entity
@Table(name = "resenas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resena {

    // Identificador unico autogenerado para cada resena registrada.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resena")
    private Long idResena;

    // Relacion muchos-a-uno: usuario que emite la resena.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relacion muchos-a-uno: destino evaluado por el usuario.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_destino", nullable = false)
    private Destino destino;

    // Puntuacion numerica otorgada al destino.
    @Column(nullable = false)
    private Integer calificacion;

    // Comentario opcional con la experiencia o recomendacion del turista.
    @Column(columnDefinition = "TEXT")
    private String comentario;

    // Marca temporal de creacion de la resena, gestionada automaticamente.
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Marca temporal de ultima actualizacion de la resena.
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
