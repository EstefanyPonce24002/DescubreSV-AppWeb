package com.example.descubresv.controller;

import com.example.descubresv.dto.request.ResenaRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.ResenaResponse;
import com.example.descubresv.service.ResenaService;
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

// Controlador de resenas con rutas publicas y de turista
@RestController
@Tag(name = "Resenas", description = "Resenas y calificaciones de destinos")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    // Lista las resenas de un destino, acceso publico
    @GetMapping("/api/destinos/{idDestino}/resenas")
    @Operation(summary = "Resenas de un destino", description = "Lista las resenas de un destino con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<ResenaResponse>>> listarPorDestino(
            @PathVariable Long idDestino, Pageable pageable) {
        PageResponse<ResenaResponse> resenas = PageResponse.of(resenaService.listarPorDestino(idDestino, pageable));
        return ResponseEntity.ok(ApiResponse.success(resenas));
    }

    // Crea una nueva resena, solo turistas autenticados
    @PostMapping("/api/turista/resenas")
    @Operation(summary = "Crear resena", description = "Crea una resena para un destino turistico")
    public ResponseEntity<ApiResponse<ResenaResponse>> crear(@Valid @RequestBody ResenaRequest request) {
        Long userId = obtenerUserId();
        ResenaResponse resena = resenaService.crear(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Resena creada exitosamente", resena));
    }

    // Lista las resenas del usuario autenticado
    @GetMapping("/api/turista/resenas")
    @Operation(summary = "Mis resenas", description = "Lista las resenas del turista autenticado")
    public ResponseEntity<ApiResponse<PageResponse<ResenaResponse>>> misResenas(Pageable pageable) {
        Long userId = obtenerUserId();
        PageResponse<ResenaResponse> resenas = PageResponse.of(resenaService.listarMisResenas(userId, pageable));
        return ResponseEntity.ok(ApiResponse.success(resenas));
    }

    // Elimina una resena propia
    @DeleteMapping("/api/turista/resenas/{id}")
    @Operation(summary = "Eliminar resena", description = "Elimina una resena del turista autenticado")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        Long userId = obtenerUserId();
        resenaService.eliminar(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Resena eliminada exitosamente", null));
    }

    // Extrae el userId del contexto de seguridad
    private Long obtenerUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (Long) ((UsernamePasswordAuthenticationToken) auth).getDetails();
    }
}
