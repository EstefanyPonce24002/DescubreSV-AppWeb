package com.example.descubresv.repository;

import com.example.descubresv.model.entity.CategoriaDestino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaDestinoRepository extends JpaRepository<CategoriaDestino, Long> {

    boolean existsByNombreCategoria(String nombreCategoria);

    boolean existsByNombreCategoriaAndIdCategoriaNot(String nombreCategoria, Long idCategoria);

    Page<CategoriaDestino> findByActivo(Boolean activo, Pageable pageable);
}
