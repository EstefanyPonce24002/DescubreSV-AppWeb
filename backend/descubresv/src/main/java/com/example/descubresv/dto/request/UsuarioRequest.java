package com.example.descubresv.dto.request;

import com.example.descubresv.model.enums.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es valido")
    private String correo;

    private String password;

    @Size(max = 100, message = "La nacionalidad no puede exceder 100 caracteres")
    private String nacionalidad;

    private String preferencias;

    private BigDecimal presupuestoEstimado;

    private String avatarUrl;

    private RolUsuario rol;

    private Boolean activo;
}
