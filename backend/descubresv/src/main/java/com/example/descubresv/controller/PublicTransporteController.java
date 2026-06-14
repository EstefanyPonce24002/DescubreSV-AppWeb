package com.example.descubresv.controller;

import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.TransporteResponse;
import com.example.descubresv.service.TransporteService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transporte")
public class PublicTransporteController {

    private final TransporteService transporteService;

    public PublicTransporteController(
            TransporteService transporteService) {

        this.transporteService = transporteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TransporteResponse>>> listar(
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                transporteService.listarActivos(pageable))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransporteResponse>> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        transporteService.buscarPorId(id)));
    }

    @GetMapping("/destino/{idDestino}")
    public ResponseEntity<ApiResponse<PageResponse<TransporteResponse>>> listarPorDestino(
            @PathVariable Long idDestino,
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                transporteService.listarPorDestino(
                                        idDestino,
                                        pageable))));
    }

    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<PageResponse<TransporteResponse>>> buscarPorTipo(
            @RequestParam String tipo,
            Pageable pageable) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        PageResponse.of(
                                transporteService.buscarPorTipo(
                                        tipo,
                                        pageable))));
    }
}