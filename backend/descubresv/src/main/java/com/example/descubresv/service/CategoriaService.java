package com.example.descubresv.service;

import com.example.descubresv.dto.request.CategoriaRequest;
import com.example.descubresv.dto.response.CategoriaResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.CategoriaDestino;
import com.example.descubresv.repository.CategoriaDestinoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaDestinoRepository categoriaRepository;

    public CategoriaService(CategoriaDestinoRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Transactional(readOnly = true)
    public Page<CategoriaResponse> listar(Pageable pageable) {
        return categoriaRepository.findAll(pageable)
                .map(CategoriaResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<CategoriaResponse> listarActivas(Pageable pageable) {
        return categoriaRepository.findByActivo(true, pageable)
                .map(CategoriaResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarActivasSinPaginar() {
        return categoriaRepository.findAll().stream()
                .filter(CategoriaDestino::getActivo)
                .map(CategoriaResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscarPorId(Long id) {
        CategoriaDestino categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + id));
        return CategoriaResponse.fromEntity(categoria);
    }

    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreCategoria(request.getNombreCategoria())) {
            throw new BadRequestException("Ya existe una categoria con el nombre: " + request.getNombreCategoria());
        }

        CategoriaDestino categoria = CategoriaDestino.builder()
                .nombreCategoria(request.getNombreCategoria())
                .descripcion(request.getDescripcion())
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build();

        return CategoriaResponse.fromEntity(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        CategoriaDestino categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + id));

        if (categoriaRepository.existsByNombreCategoriaAndIdCategoriaNot(request.getNombreCategoria(), id)) {
            throw new BadRequestException("Ya existe otra categoria con el nombre: " + request.getNombreCategoria());
        }

        categoria.setNombreCategoria(request.getNombreCategoria());
        categoria.setDescripcion(request.getDescripcion());
        if (request.getActivo() != null) {
            categoria.setActivo(request.getActivo());
        }

        return CategoriaResponse.fromEntity(categoriaRepository.save(categoria));
    }

    @Transactional
    public void eliminar(Long id) {
        CategoriaDestino categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada con id: " + id));
        categoriaRepository.delete(categoria);
    }
}
