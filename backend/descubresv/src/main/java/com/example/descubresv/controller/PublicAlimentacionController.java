package com.example.descubresv.controller;

import com.example.descubresv.dto.response.AlimentacionResponse;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.service.AlimentacionService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alimentacion")
public class PublicAlimentacionController {

    private final AlimentacionService alimentacionService;

    public PublicAlimentacionController(
            AlimentacionService alimentacionService) {

        this.alimentacionService = alimentacionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AlimentacionResponse>>> listar(
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                alimentacionService.listarActivos(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AlimentacionResponse>> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        alimentacionService.buscarPorId(id)));
    }

    @GetMapping("/destino/{idDestino}")
    public ResponseEntity<ApiResponse<PageResponse<AlimentacionResponse>>> listarPorDestino(
            @PathVariable Long idDestino,
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                alimentacionService.listarPorDestino(
                                        idDestino,
                                        pageable))));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<PageResponse<AlimentacionResponse>>> buscarPorNombre(
            @RequestParam String nombre,
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                alimentacionService.buscarPorNombre(
                                        nombre,
                                        pageable))));
    }
}