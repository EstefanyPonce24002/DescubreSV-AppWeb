package com.example.descubresv.controller;

import com.example.descubresv.dto.request.AlimentacionRequest;
import com.example.descubresv.dto.response.AlimentacionResponse;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.service.AlimentacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/alimentacion")
@Tag(name = "ADMINISTRAR ALIMENTACION", description = "Gestion de lugares de alimentacion")
public class AdminAlimentacionController {

    private final AlimentacionService alimentacionService;

    public AdminAlimentacionController(AlimentacionService alimentacionService) {
        this.alimentacionService = alimentacionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AlimentacionResponse>>> listar(Pageable pageable) {
        PageResponse<AlimentacionResponse> data =
                PageResponse.of(alimentacionService.listar(pageable));

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlimentacionResponse>> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(alimentacionService.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AlimentacionResponse>> crear(
            @Valid @RequestBody AlimentacionRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Alimentacion creada exitosamente",
                        alimentacionService.crear(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AlimentacionResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AlimentacionRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Alimentacion actualizada exitosamente",
                        alimentacionService.actualizar(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminar(
            @PathVariable Long id) {

        alimentacionService.eliminar(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Alimentacion eliminada exitosamente",
                        null));
    }
}