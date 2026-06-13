package com.example.descubresv.controller;

import com.example.descubresv.dto.request.PresupuestoRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PresupuestoResponse;
import com.example.descubresv.service.PresupuestoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

// Controlador de presupuestos vinculados a itinerarios
@RestController
@RequestMapping("/api/turista/itinerarios/{idItinerario}/presupuesto")
@Tag(name = "Presupuestos", description = "Calculo y gestion de presupuestos de viaje")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    public PresupuestoController(PresupuestoService presupuestoService) {
        this.presupuestoService = presupuestoService;
    }

    // Obtiene el presupuesto del itinerario
    @GetMapping
    @Operation(summary = "Ver presupuesto", description = "Obtiene el presupuesto de un itinerario")
    public ResponseEntity<ApiResponse<PresupuestoResponse>> obtener(@PathVariable Long idItinerario) {
        Long userId = obtenerUserId();
        PresupuestoResponse presupuesto = presupuestoService.obtenerPorItinerario(userId, idItinerario);
        return ResponseEntity.ok(ApiResponse.success(presupuesto));
    }

    // Crea o actualiza el presupuesto del itinerario, calcula el total automaticamente
    @PutMapping
    @Operation(summary = "Guardar presupuesto", description = "Crea o actualiza el presupuesto con calculo automatico del total")
    public ResponseEntity<ApiResponse<PresupuestoResponse>> guardar(
            @PathVariable Long idItinerario,
            @RequestBody PresupuestoRequest request) {
        Long userId = obtenerUserId();
        PresupuestoResponse presupuesto = presupuestoService.guardar(userId, idItinerario, request);
        return ResponseEntity.ok(ApiResponse.success("Presupuesto guardado exitosamente", presupuesto));
    }

    // Extrae el userId del contexto de seguridad
    private Long obtenerUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) ((UsernamePasswordAuthenticationToken) auth).getDetails();
    }
}
