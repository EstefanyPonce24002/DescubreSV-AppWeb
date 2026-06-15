package com.example.descubresv.controller;

import com.example.descubresv.dto.request.PresupuestoRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PresupuestoResponse;
import com.example.descubresv.service.PresupuestoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/presupuestos")
@Tag(name = "Presupuestos", description = "Calculo y gestion de presupuestos de viaje")
public class PresupuestoController {

    private final PresupuestoService presupuestoService;

    public PresupuestoController(PresupuestoService presupuestoService) {
        this.presupuestoService = presupuestoService;
    }

    @GetMapping("/itinerario/{idItinerario}")
    @Operation(summary = "Ver presupuesto")
    public ResponseEntity<ApiResponse<PresupuestoResponse>> obtener(
            @PathVariable Long idItinerario, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        PresupuestoResponse presupuesto = presupuestoService.obtenerPorItinerario(userId, esAdmin, idItinerario);
        return ResponseEntity.ok(ApiResponse.success(presupuesto));
    }

    @PostMapping
    @Operation(summary = "Guardar presupuesto")
    public ResponseEntity<ApiResponse<PresupuestoResponse>> crear(
            @RequestBody PresupuestoRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        PresupuestoResponse presupuesto = presupuestoService.guardar(userId, esAdmin, request.getIdItinerario(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Presupuesto guardado exitosamente", presupuesto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar presupuesto")
    public ResponseEntity<ApiResponse<PresupuestoResponse>> actualizar(
            @PathVariable Long id,
            @RequestBody PresupuestoRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        PresupuestoResponse presupuesto = presupuestoService.guardar(userId, esAdmin, request.getIdItinerario(), request);
        return ResponseEntity.ok(ApiResponse.success("Presupuesto actualizado exitosamente", presupuesto));
    }

    private Long obtenerUserId(Authentication auth) {
        return (Long) ((UsernamePasswordAuthenticationToken) auth).getDetails();
    }
}
