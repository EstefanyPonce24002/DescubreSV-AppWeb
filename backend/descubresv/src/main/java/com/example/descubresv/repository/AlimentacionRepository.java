package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Alimentacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlimentacionRepository extends JpaRepository<Alimentacion, Long> {

    Page<Alimentacion> findByActivo(Boolean activo, Pageable pageable);

    Page<Alimentacion> findByDestinoIdDestinoAndActivo(
            Long idDestino,
            Boolean activo,
            Pageable pageable);

    Page<Alimentacion> findByNombreContainingIgnoreCaseAndActivo(
            String nombre,
            Boolean activo,
            Pageable pageable);
}