package com.example.descubresv.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaRequest {

    @NotBlank(message = "El nombre de la categoria es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre de la categoria debe tener entre 2 y 100 caracteres")
    private String nombreCategoria;

    private String descripcion;

    private Boolean activo;
}
