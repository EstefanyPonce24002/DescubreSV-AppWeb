package com.example.descubresv.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Prueba", description = "Controlador para verificar el funcionamiento inicial")
public class HolaMundoController {

    @GetMapping("/hola")
    @Operation(summary = "Saludar", description = "Retorna un mensaje de bienvenida")
    public String saludar() {
        return "¡Hola Mundo.";
    }
}
