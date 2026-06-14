package com.example.descubresv.service;

import com.example.descubresv.dto.request.AlimentacionRequest;
import com.example.descubresv.dto.response.AlimentacionResponse;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Alimentacion;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.repository.AlimentacionRepository;
import com.example.descubresv.repository.DestinoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AlimentacionService {

    private final AlimentacionRepository alimentacionRepository;
    private final DestinoRepository destinoRepository;

    public AlimentacionService(
            AlimentacionRepository alimentacionRepository,
            DestinoRepository destinoRepository) {

        this.alimentacionRepository = alimentacionRepository;
        this.destinoRepository = destinoRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlimentacionResponse> listar(Pageable pageable) {
        return alimentacionRepository.findAll(pageable)
                .map(AlimentacionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<AlimentacionResponse> listarActivos(Pageable pageable) {
        return alimentacionRepository.findByActivo(true, pageable)
                .map(AlimentacionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<AlimentacionResponse> listarPorDestino(
            Long idDestino,
            Pageable pageable) {

        return alimentacionRepository
                .findByDestinoIdDestinoAndActivo(idDestino, true, pageable)
                .map(AlimentacionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<AlimentacionResponse> buscarPorNombre(
            String nombre,
            Pageable pageable) {

        return alimentacionRepository
                .findByNombreContainingIgnoreCaseAndActivo(nombre, true, pageable)
                .map(AlimentacionResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public AlimentacionResponse buscarPorId(Long id) {

        Alimentacion alimentacion = alimentacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alimentación no encontrada con id: " + id));

        return AlimentacionResponse.fromEntity(alimentacion);
    }

    @Transactional
    public AlimentacionResponse crear(AlimentacionRequest request) {

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id: "
                                + request.getIdDestino()));

        Alimentacion alimentacion = Alimentacion.builder()
                .nombre(request.getNombre())
                .tipoComida(request.getTipoComida())
                .precioPromedio(
                        request.getPrecioPromedio() != null
                                ? request.getPrecioPromedio()
                                : BigDecimal.ZERO)
                .ubicacion(request.getUbicacion())
                .horario(request.getHorario())
                .calificacion(request.getCalificacion())
                .destino(destino)
                .activo(request.getActivo() != null
                        ? request.getActivo()
                        : true)
                .build();

        return AlimentacionResponse.fromEntity(
                alimentacionRepository.save(alimentacion));
    }

    @Transactional
    public AlimentacionResponse actualizar(
            Long id,
            AlimentacionRequest request) {

        Alimentacion alimentacion = alimentacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alimentación no encontrada con id: " + id));

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id: "
                                + request.getIdDestino()));

        alimentacion.setNombre(request.getNombre());
        alimentacion.setTipoComida(request.getTipoComida());
        alimentacion.setPrecioPromedio(
                request.getPrecioPromedio() != null
                        ? request.getPrecioPromedio()
                        : BigDecimal.ZERO);
        alimentacion.setUbicacion(request.getUbicacion());
        alimentacion.setHorario(request.getHorario());
        alimentacion.setCalificacion(request.getCalificacion());
        alimentacion.setDestino(destino);

        if (request.getActivo() != null) {
            alimentacion.setActivo(request.getActivo());
        }

        return AlimentacionResponse.fromEntity(
                alimentacionRepository.save(alimentacion));
    }

    @Transactional
    public void eliminar(Long id) {

        Alimentacion alimentacion = alimentacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Alimentación no encontrada con id: " + id));

        alimentacionRepository.delete(alimentacion);
    }
}