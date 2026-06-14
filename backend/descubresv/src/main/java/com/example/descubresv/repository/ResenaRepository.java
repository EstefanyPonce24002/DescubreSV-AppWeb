package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Resena;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio de resenas - por destino y por usuario
@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    Page<Resena> findByDestinoIdDestino(Long idDestino, Pageable pageable);

    Page<Resena> findByUsuarioIdUsuario(Long idUsuario, Pageable pageable);
}
