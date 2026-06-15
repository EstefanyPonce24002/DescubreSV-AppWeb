package com.example.descubresv.controller;

import com.example.descubresv.dto.request.ItinerarioDestinoRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.ItinerarioDestinoResponse;
import com.example.descubresv.dto.response.ItinerarioResponse;
import com.example.descubresv.service.ItinerarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itinerario-destinos")
@Tag(name = "Itinerario Destinos", description = "Gestion de paradas de itinerario")
public class ItinerarioDestinoController {

    private final ItinerarioService itinerarioService;

    public ItinerarioDestinoController(ItinerarioService itinerarioService) {
        this.itinerarioService = itinerarioService;
    }

    @GetMapping("/itinerario/{idItinerario}")
    @Operation(summary = "Obtener destinos de un itinerario")
    public ResponseEntity<ApiResponse<List<ItinerarioDestinoResponse>>> obtenerPorItinerario(
            @PathVariable Long idItinerario, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ItinerarioResponse itinerario = itinerarioService.obtenerPorId(userId, esAdmin, idItinerario);
        return ResponseEntity.ok(ApiResponse.success(itinerario.getDestinos()));
    }

    @PostMapping
    @Operation(summary = "Agregar destino a itinerario")
    public ResponseEntity<ApiResponse<ItinerarioDestinoResponse>> crear(
            @Valid @RequestBody ItinerarioDestinoRequest request, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        ItinerarioDestinoResponse response = itinerarioService.agregarDestino(userId, esAdmin, request.getIdItinerario(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Destino agregado al itinerario", response));
    }

    @DeleteMapping("/{idItinerario}/{idDestino}")
    @Operation(summary = "Quitar destino de itinerario")
    public ResponseEntity<ApiResponse<String>> eliminar(
            @PathVariable Long idItinerario,
            @PathVariable Long idDestino, Authentication auth) {
        Long userId = obtenerUserId(auth);
        boolean esAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        itinerarioService.quitarDestino(userId, esAdmin, idItinerario, idDestino);
        return ResponseEntity.ok(ApiResponse.success("Destino eliminado del itinerario", null));
    }

    private Long obtenerUserId(Authentication auth) {
        return (Long) ((UsernamePasswordAuthenticationToken) auth).getDetails();
    }
}
