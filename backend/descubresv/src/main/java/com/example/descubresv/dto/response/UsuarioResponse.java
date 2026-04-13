package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Datos del usuario que se envían al cliente, sin exponer el password
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponse {

    private Long idUsuario;
    private String nombre;
    private String correo;
    private String nacionalidad;
    private String avatarUrl;
    private RolUsuario rol;
    private Boolean activo;
    private LocalDateTime createdAt;

    // Convierte una entidad Usuario a DTO de respuesta
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return UsuarioResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .nacionalidad(usuario.getNacionalidad())
                .avatarUrl(usuario.getAvatarUrl())
                .rol(usuario.getRol())
                .activo(usuario.getActivo())
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}
