package com.example.descubresv.dto.response;

import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long idUsuario;
    private String nombre;
    private String correo;
    private String avatarUrl;
    private RolUsuario rol;

    public static AuthResponse fromEntity(Usuario usuario) {
        return AuthResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .avatarUrl(usuario.getAvatarUrl())
                .rol(usuario.getRol())
                .build();
    }
}
