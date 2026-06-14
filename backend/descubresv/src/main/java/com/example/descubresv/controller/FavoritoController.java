package com.example.descubresv.controller;

import com.example.descubresv.dto.request.FavoritoRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.FavoritoResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.service.FavoritoService;
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

@RestController
@Tag(name = "Favoritos", description = "Gestion de destinos favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @PostMapping("/api/turista/favoritos")
    @Operation(summary = "Agregar favorito")
    public ResponseEntity<ApiResponse<FavoritoResponse>> crear(
            @Valid @RequestBody FavoritoRequest request) {

        Long userId = obtenerUserId();

        FavoritoResponse favorito =
                favoritoService.crear(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Favorito agregado exitosamente",
                        favorito));
    }

    @GetMapping("/api/turista/favoritos")
    @Operation(summary = "Mis favoritos")
    public ResponseEntity<ApiResponse<PageResponse<FavoritoResponse>>> listar(
            Pageable pageable) {

        Long userId = obtenerUserId();

        PageResponse<FavoritoResponse> favoritos =
                PageResponse.of(
                        favoritoService.listarMisFavoritos(userId, pageable));

        return ResponseEntity.ok(ApiResponse.success(favoritos));
    }

    @DeleteMapping("/api/turista/favoritos/{id}")
    @Operation(summary = "Eliminar favorito")
    public ResponseEntity<ApiResponse<String>> eliminar(
            @PathVariable Long id) {

        Long userId = obtenerUserId();

        favoritoService.eliminar(userId, id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Favorito eliminado exitosamente",
                        null));
    }

    private Long obtenerUserId() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        return (Long) ((UsernamePasswordAuthenticationToken) auth)
                .getDetails();
    }
}