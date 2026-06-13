package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Itinerario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repositorio de itinerarios
@Repository
public interface ItinerarioRepository extends JpaRepository<Itinerario, Long> {

    Page<Itinerario> findByUsuarioIdUsuarioAndActivo(Long idUsuario, Boolean activo, Pageable pageable);
}
