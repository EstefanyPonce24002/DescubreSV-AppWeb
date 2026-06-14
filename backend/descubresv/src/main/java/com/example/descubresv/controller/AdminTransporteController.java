package com.example.descubresv.controller;

import com.example.descubresv.dto.request.TransporteRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.TransporteResponse;
import com.example.descubresv.service.TransporteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/transporte")
public class AdminTransporteController {

    private final TransporteService transporteService;

    public AdminTransporteController(
            TransporteService transporteService) {

        this.transporteService = transporteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TransporteResponse>>> listar(
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                transporteService.listar(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransporteResponse>> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        transporteService.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransporteResponse>> crear(
            @Valid @RequestBody TransporteRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Transporte creado exitosamente",
                        transporteService.crear(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransporteResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TransporteRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transporte actualizado exitosamente",
                        transporteService.actualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(
            @PathVariable Long id) {

        transporteService.eliminar(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Transporte eliminado exitosamente",
                        null));
    }
}