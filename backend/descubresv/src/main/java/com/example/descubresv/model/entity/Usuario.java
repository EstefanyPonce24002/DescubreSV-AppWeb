package com.example.descubresv.model.entity;

import com.example.descubresv.model.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entidad usuario - mapea la tabla usuarios
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    // Identificador único autogenerado del usuario.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    // Nombre visible del usuario dentro de la plataforma.
    @Column(nullable = false, length = 100)
    private String nombre;

    // Correo electrónico único usado para autenticación y contacto.
    @Column(nullable = false, unique = true, length = 150)
    private String correo;

    // Hash de la contraseña; no se almacena la contraseña en texto plano.
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 100)
    private String nacionalidad;

    @Column(columnDefinition = "TEXT")
    private String preferencias;

    @Column(name = "presupuesto_estimado", precision = 10, scale = 2)
    private BigDecimal presupuestoEstimado;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    // Rol de permisos del usuario dentro del sistema (ej. TURISTA, ADMIN).
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "rol_usuario DEFAULT 'TURISTA'")
    private RolUsuario rol;

    // Estado lógico para activar/desactivar cuentas sin eliminar el historial.
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