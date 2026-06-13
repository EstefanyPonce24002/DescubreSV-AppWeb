package com.example.descubresv.controller;

import com.example.descubresv.dto.request.CategoriaRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.CategoriaResponse;
import com.example.descubresv.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categorias")
@Tag(name = "ADMINISTRAR CATEGORIAS", description = "Gestion de categorias de destinos por el administrador")
public class AdminCategoriaController {

    private final CategoriaService categoriaService;

    public AdminCategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    @Operation(summary = "Listar todas las categorias", description = "Lista todas las categorias con paginacion para el administrador")
    public ResponseEntity<ApiResponse<PageResponse<CategoriaResponse>>> listar(Pageable pageable) {
        PageResponse<CategoriaResponse> categorias = PageResponse.of(categoriaService.listar(pageable));
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener categoria", description = "Obtiene el detalle de una categoria por su id")
    public ResponseEntity<ApiResponse<CategoriaResponse>> obtenerPorId(@PathVariable Long id) {
        CategoriaResponse categoria = categoriaService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success(categoria));
    }

    @PostMapping
    @Operation(summary = "Crear categoria", description = "Crea una nueva categoria de destino")
    public ResponseEntity<ApiResponse<CategoriaResponse>> crear(@Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse categoria = categoriaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Categoria creada exitosamente", categoria));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar categoria", description = "Actualiza una categoria existente")
    public ResponseEntity<ApiResponse<CategoriaResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request) {
        CategoriaResponse categoria = categoriaService.actualizar(id, request);
        return ResponseEntity.ok(ApiResponse.success("Categoria actualizada exitosamente", categoria));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar categoria", description = "Elimina una categoria")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success("Categoria eliminada exitosamente", null));
    }
}
