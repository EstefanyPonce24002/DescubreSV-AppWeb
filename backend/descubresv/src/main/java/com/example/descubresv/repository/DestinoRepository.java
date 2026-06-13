package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Destino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinoRepository extends JpaRepository<Destino, Long> {

    Page<Destino> findByActivo(Boolean activo, Pageable pageable);

    Page<Destino> findByCategoriaIdCategoriaAndActivo(Long idCategoria, Boolean activo, Pageable pageable);

    Page<Destino> findByDepartamentoAndActivo(String departamento, Boolean activo, Pageable pageable);

    Page<Destino> findByNombreContainingIgnoreCaseAndActivo(String nombre, Boolean activo, Pageable pageable);
}
