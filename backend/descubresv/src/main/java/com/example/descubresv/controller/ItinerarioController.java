package com.example.descubresv.controller;

import com.example.descubresv.dto.request.ItinerarioDestinoRequest;
import com.example.descubresv.dto.request.ItinerarioRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.ItinerarioDestinoResponse;
import com.example.descubresv.dto.response.ItinerarioResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.service.ItinerarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

// Controlador de itinerarios para turistas autenticados
@RestController
@RequestMapping("/api/itinerarios")
@Tag(name = "Itinerarios", description = "Planificacion de itinerarios de viaje")
public class ItinerarioController {

    private final ItinerarioService itinerarioService;

    public ItinerarioController(ItinerarioService itinerarioService) {
        this.itinerarioService = itinerarioService;
    }

    @GetMapping
    @Operation(summary = "Mis itinerarios", description = "Lista los itinerarios del turista autenticado")
    public ResponseEntity<ApiResponse<PageResponse<ItinerarioResponse>>> listar(Pageable pageable, Authentication auth) {
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        PageResponse<ItinerarioResponse> itinerarios;
        if (esAdmin) {
            itinerarios = PageResponse.of(itinerarioService.listarTodos(pageable));
        } else {
            Long userId = obtenerUserId(auth);
            itinerarios = PageResponse.of(itinerarioService.listarMisItinerarios(userId, pageable));
        }
        return ResponseEntity.ok(ApiResponse.success(itinerarios));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalle de itinerario", description = "Obtiene un itinerario con sus destinos incluidos")
    public ResponseEntity<ApiResponse<ItinerarioResponse>> obtener(@PathVariable Long id, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ItinerarioResponse itinerario = itinerarioService.obtenerPorId(userId, esAdmin, id);
        return ResponseEntity.ok(ApiResponse.success(itinerario));
    }

    @PostMapping
    @Operation(summary = "Crear itinerario", description = "Crea un nuevo itinerario de viaje")
    public ResponseEntity<ApiResponse<ItinerarioResponse>> crear(
            @Valid @RequestBody ItinerarioRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        ItinerarioResponse itinerario = itinerarioService.crear(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Itinerario creado exitosamente", itinerario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar itinerario", description = "Actualiza un itinerario existente")
    public ResponseEntity<ApiResponse<ItinerarioResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ItinerarioRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ItinerarioResponse itinerario = itinerarioService.actualizar(userId, esAdmin, id, request);
        return ResponseEntity.ok(ApiResponse.success("Itinerario actualizado exitosamente", itinerario));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar itinerario", description = "Desactiva un itinerario de viaje")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        itinerarioService.eliminar(userId, esAdmin, id);
        return ResponseEntity.ok(ApiResponse.success("Itinerario eliminado exitosamente", null));
    }

    @PostMapping("/{id}/destinos")
    @Operation(summary = "Agregar destino", description = "Agrega un destino al itinerario con dia y orden")
    public ResponseEntity<ApiResponse<ItinerarioDestinoResponse>> agregarDestino(
            @PathVariable Long id,
            @Valid @RequestBody ItinerarioDestinoRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ItinerarioDestinoResponse destino = itinerarioService.agregarDestino(userId, esAdmin, id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Destino agregado al itinerario", destino));
    }

    @DeleteMapping("/{id}/destinos/{idDestino}")
    @Operation(summary = "Quitar destino", description = "Quita un destino del itinerario")
    public ResponseEntity<ApiResponse<String>> quitarDestino(
            @PathVariable Long id,
            @PathVariable Long idDestino, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        itinerarioService.quitarDestino(userId, esAdmin, id, idDestino);
        return ResponseEntity.ok(ApiResponse.success("Destino eliminado del itinerario", null));
    }

    private Long obtenerUserId(Authentication auth) {
        return (Long) ((UsernamePasswordAuthenticationToken) auth).getDetails();
    }
}
