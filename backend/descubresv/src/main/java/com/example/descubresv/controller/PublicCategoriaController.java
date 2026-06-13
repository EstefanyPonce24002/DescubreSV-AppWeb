package com.example.descubresv.controller;

import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.CategoriaResponse;
import com.example.descubresv.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "PUBLIC CATEGORIAS", description = "Endpoints publicos para listar categorias")
public class PublicCategoriaController {

    private final CategoriaService categoriaService;

    public PublicCategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Listar categorias activas", description = "Lista todas las categorias activas con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<CategoriaResponse>>> listarActivas(Pageable pageable) {
        PageResponse<CategoriaResponse> categorias = PageResponse.of(categoriaService.listarActivas(pageable));
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    @GetMapping("/list")
    @Operation(summary = "Listar todas las categorias activas sin paginacion", description = "Obtiene la lista completa de categorias activas para selectores")
    public ResponseEntity<ApiResponse<List<CategoriaResponse>>> listarActivasSinPaginar() {
        List<CategoriaResponse> categorias = categoriaService.listarActivasSinPaginar();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }
}
