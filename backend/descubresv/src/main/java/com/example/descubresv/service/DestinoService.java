package com.example.descubresv.service;

import com.example.descubresv.dto.request.DestinoRequest;
import com.example.descubresv.dto.response.DestinoResponse;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.CategoriaDestino;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.repository.CategoriaDestinoRepository;
import com.example.descubresv.repository.DestinoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class DestinoService {

    private final DestinoRepository destinoRepository;
    private final CategoriaDestinoRepository categoriaRepository;

    public DestinoService(DestinoRepository destinoRepository, CategoriaDestinoRepository categoriaRepository) {
        this.destinoRepository = destinoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public Page<DestinoResponse> listar(Pageable pageable) {
        return destinoRepository.findAll(pageable)
                .map(DestinoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<DestinoResponse> listarActivos(Pageable pageable) {
        return destinoRepository.findByActivo(true, pageable)
                .map(DestinoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<DestinoResponse> listarActivosPorCategoria(Long idCategoria, Pageable pageable) {
        return destinoRepository.findByCategoriaIdCategoriaAndActivo(idCategoria, true, pageable)
                .map(DestinoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<DestinoResponse> listarActivosPorDepartamento(String departamento, Pageable pageable) {
        return destinoRepository.findByDepartamentoAndActivo(departamento, true, pageable)
                .map(DestinoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<DestinoResponse> buscarActivosPorNombre(String nombre, Pageable pageable) {
        return destinoRepository.findByNombreContainingIgnoreCaseAndActivo(nombre, true, pageable)
                .map(DestinoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public DestinoResponse buscarPorId(Long id) {
        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + id));
        return DestinoResponse.fromEntity(destino);
    }

    @Transactional
    public DestinoResponse crear(DestinoRequest request) {
        CategoriaDestino categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + request.getIdCategoria()));

        Destino destino = Destino.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .departamento(request.getDepartamento())
                .precioEntrada(request.getPrecioEntrada() != null ? request.getPrecioEntrada() : BigDecimal.ZERO)
                .horario(request.getHorario())
                .mejorEpoca(request.getMejorEpoca())
                .tipo(request.getTipo())
                .comoLlegarVehiculo(request.getComoLlegarVehiculo())
                .comoLlegarBus(request.getComoLlegarBus())
                .latitud(request.getLatitud())
                .longitud(request.getLongitud())
                .imagenUrl(request.getImagenUrl())
                .calificacionPromedio(BigDecimal.ZERO)
                .categoria(categoria)
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build();

        return DestinoResponse.fromEntity(destinoRepository.save(destino));
    }

    @Transactional
    public DestinoResponse actualizar(Long id, DestinoRequest request) {
        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + id));

        CategoriaDestino categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + request.getIdCategoria()));

        destino.setNombre(request.getNombre());
        destino.setDescripcion(request.getDescripcion());
        destino.setDepartamento(request.getDepartamento());
        destino.setPrecioEntrada(request.getPrecioEntrada() != null ? request.getPrecioEntrada() : BigDecimal.ZERO);
        destino.setHorario(request.getHorario());
        destino.setMejorEpoca(request.getMejorEpoca());
        destino.setTipo(request.getTipo());
        destino.setComoLlegarVehiculo(request.getComoLlegarVehiculo());
        destino.setComoLlegarBus(request.getComoLlegarBus());
        destino.setLatitud(request.getLatitud());
        destino.setLongitud(request.getLongitud());
        destino.setImagenUrl(request.getImagenUrl());
        destino.setCategoria(categoria);

        if (request.getActivo() != null) {
            destino.setActivo(request.getActivo());
        }

        return DestinoResponse.fromEntity(destinoRepository.save(destino));
    }

    @Transactional
    public void eliminar(Long id) {
        Destino destino = destinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destino no encontrado con id: " + id));
        destinoRepository.delete(destino);
    }
}
