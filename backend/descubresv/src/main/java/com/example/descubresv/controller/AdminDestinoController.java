package com.example.descubresv.controller;

import com.example.descubresv.dto.request.DestinoRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.DestinoResponse;
import com.example.descubresv.service.DestinoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/destinos")
@Tag(name = "ADMINISTRAR DESTINOS", description = "Gestion de destinos turisticos por el administrador")
public class AdminDestinoController {

    private final DestinoService destinoService;

    public AdminDestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @GetMapping
    @Operation(summary = "Listar todos los destinos", description = "Lista todos los destinos con paginacion para el administrador")
    public ResponseEntity<ApiResponse<PageResponse<DestinoResponse>>> listar(Pageable pageable) {
        PageResponse<DestinoResponse> destinos = PageResponse.of(destinoService.listar(pageable));
        return ResponseEntity.ok(ApiResponse.success(destinos));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener destino", description = "Obtiene el detalle de un destino por su id")
    public ResponseEntity<ApiResponse<DestinoResponse>> obtenerPorId(@PathVariable Long id) {
        DestinoResponse destino = destinoService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success(destino));
    }

    @PostMapping
    @Operation(summary = "Crear destino", description = "Crea un nuevo destino turistico")
    public ResponseEntity<ApiResponse<DestinoResponse>> crear(@Valid @RequestBody DestinoRequest request) {
        DestinoResponse destino = destinoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Destino creado exitosamente", destino));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar destino", description = "Actualiza un destino existente")
    public ResponseEntity<ApiResponse<DestinoResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DestinoRequest request) {
        DestinoResponse destino = destinoService.actualizar(id, request);
        return ResponseEntity.ok(ApiResponse.success("Destino actualizado exitosamente", destino));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar destino", description = "Elimina un destino")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        destinoService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success("Destino eliminado exitosamente", null));
    }
}
