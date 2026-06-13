package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private BigDecimal presupuestoEstimado;
    private String preferencias;
    private LocalDateTime createdAt;

    public static UsuarioResponse fromEntity(Usuario usuario) {
        return UsuarioResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .nacionalidad(usuario.getNacionalidad())
                .avatarUrl(usuario.getAvatarUrl())
                .rol(usuario.getRol())
                .activo(usuario.getActivo())
                .presupuestoEstimado(usuario.getPresupuestoEstimado())
                .preferencias(usuario.getPreferencias())
                .createdAt(usuario.getCreatedAt())
                .build();
    }
}
