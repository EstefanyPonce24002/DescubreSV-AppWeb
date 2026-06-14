package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Transporte;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransporteRepository extends JpaRepository<Transporte, Long> {

    Page<Transporte> findByActivo(Boolean activo, Pageable pageable);

    Page<Transporte> findByDestinoIdDestinoAndActivo(
            Long idDestino,
            Boolean activo,
            Pageable pageable);

    Page<Transporte> findByTipoContainingIgnoreCaseAndActivo(
            String tipo,
            Boolean activo,
            Pageable pageable);
}