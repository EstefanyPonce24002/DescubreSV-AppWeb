package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Favorito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    Page<Favorito> findByUsuarioIdUsuario(Long idUsuario, Pageable pageable);

    boolean existsByUsuarioIdUsuarioAndDestinoIdDestino(
            Long idUsuario,
            Long idDestino);
}