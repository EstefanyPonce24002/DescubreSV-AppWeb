package com.example.descubresv.controller;

import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.DestinoResponse;
import com.example.descubresv.service.DestinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/destinos")
@Tag(name = "PUBLIC DESTINOS", description = "Endpoints publicos para ver destinos turisticos")
public class PublicDestinoController {

    private final DestinoService destinoService;

    public PublicDestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @GetMapping
    @Operation(summary = "Listar destinos activos", description = "Lista todos los destinos activos con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<DestinoResponse>>> listarActivos(Pageable pageable) {
        PageResponse<DestinoResponse> destinos = PageResponse.of(destinoService.listarActivos(pageable));
        return ResponseEntity.ok(ApiResponse.success(destinos));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener destino", description = "Obtiene el detalle de un destino por su id")
    public ResponseEntity<ApiResponse<DestinoResponse>> obtenerPorId(@PathVariable Long id) {
        DestinoResponse destino = destinoService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success(destino));
    }

    @GetMapping("/categoria/{idCategoria}")
    @Operation(summary = "Listar por categoria", description = "Lista los destinos activos pertenecientes a una categoria con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<DestinoResponse>>> listarPorCategoria(
            @PathVariable Long idCategoria, Pageable pageable) {
        PageResponse<DestinoResponse> destinos = PageResponse.of(destinoService.listarActivosPorCategoria(idCategoria, pageable));
        return ResponseEntity.ok(ApiResponse.success(destinos));
    }

    @GetMapping("/departamento/{departamento}")
    @Operation(summary = "Listar por departamento", description = "Lista los destinos activos pertenecientes a un departamento con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<DestinoResponse>>> listarPorDepartamento(
            @PathVariable String departamento, Pageable pageable) {
        PageResponse<DestinoResponse> destinos = PageResponse.of(destinoService.listarActivosPorDepartamento(departamento, pageable));
        return ResponseEntity.ok(ApiResponse.success(destinos));
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar por nombre", description = "Busca destinos activos por una coincidencia en el nombre con paginacion")
    public ResponseEntity<ApiResponse<PageResponse<DestinoResponse>>> buscarPorNombre(
            @RequestParam String nombre, Pageable pageable) {
        PageResponse<DestinoResponse> destinos = PageResponse.of(destinoService.buscarActivosPorNombre(nombre, pageable));
        return ResponseEntity.ok(ApiResponse.success(destinos));
    }
}
