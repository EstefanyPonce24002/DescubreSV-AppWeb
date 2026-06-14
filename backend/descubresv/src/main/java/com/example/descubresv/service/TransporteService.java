package com.example.descubresv.service;

import com.example.descubresv.dto.request.TransporteRequest;
import com.example.descubresv.dto.response.TransporteResponse;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.model.entity.Transporte;
import com.example.descubresv.repository.DestinoRepository;
import com.example.descubresv.repository.TransporteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TransporteService {

    private final TransporteRepository transporteRepository;
    private final DestinoRepository destinoRepository;

    public TransporteService(
            TransporteRepository transporteRepository,
            DestinoRepository destinoRepository) {

        this.transporteRepository = transporteRepository;
        this.destinoRepository = destinoRepository;
    }

    @Transactional(readOnly = true)
    public Page<TransporteResponse> listar(Pageable pageable) {
        return transporteRepository.findAll(pageable)
                .map(TransporteResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<TransporteResponse> listarActivos(Pageable pageable) {
        return transporteRepository.findByActivo(true, pageable)
                .map(TransporteResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<TransporteResponse> listarPorDestino(
            Long idDestino,
            Pageable pageable) {

        return transporteRepository
                .findByDestinoIdDestinoAndActivo(idDestino, true, pageable)
                .map(TransporteResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<TransporteResponse> buscarPorTipo(
            String tipo,
            Pageable pageable) {

        return transporteRepository
                .findByTipoContainingIgnoreCaseAndActivo(tipo, true, pageable)
                .map(TransporteResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public TransporteResponse buscarPorId(Long id) {

        Transporte transporte = transporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transporte no encontrado con id: " + id));

        return TransporteResponse.fromEntity(transporte);
    }

    @Transactional
    public TransporteResponse crear(TransporteRequest request) {

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id: "
                                + request.getIdDestino()));

        Transporte transporte = Transporte.builder()
                .tipo(request.getTipo())
                .costo(request.getCosto() != null
                        ? request.getCosto()
                        : BigDecimal.ZERO)
                .capacidad(request.getCapacidad())
                .tiempoEstimado(request.getTiempoEstimado())
                .destino(destino)
                .activo(request.getActivo() != null
                        ? request.getActivo()
                        : true)
                .build();

        return TransporteResponse.fromEntity(
                transporteRepository.save(transporte));
    }

    @Transactional
    public TransporteResponse actualizar(
            Long id,
            TransporteRequest request) {

        Transporte transporte = transporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transporte no encontrado con id: " + id));

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id: "
                                + request.getIdDestino()));

        transporte.setTipo(request.getTipo());
        transporte.setCosto(request.getCosto() != null
                ? request.getCosto()
                : BigDecimal.ZERO);
        transporte.setCapacidad(request.getCapacidad());
        transporte.setTiempoEstimado(request.getTiempoEstimado());
        transporte.setDestino(destino);

        if (request.getActivo() != null) {
            transporte.setActivo(request.getActivo());
        }

        return TransporteResponse.fromEntity(
                transporteRepository.save(transporte));
    }

    @Transactional
    public void eliminar(Long id) {

        Transporte transporte = transporteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transporte no encontrado con id: " + id));

        transporteRepository.delete(transporte);
    }
}