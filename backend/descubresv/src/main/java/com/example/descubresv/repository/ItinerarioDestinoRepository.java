package com.example.descubresv.repository;

import com.example.descubresv.model.entity.ItinerarioDestino;
import com.example.descubresv.model.entity.ItinerarioDestinoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repositorio de itinerario-destinos 
@Repository
public interface ItinerarioDestinoRepository extends JpaRepository<ItinerarioDestino, ItinerarioDestinoId> {

    List<ItinerarioDestino> findByItinerarioIdItinerarioOrderByDiaNumeroAscOrdenAsc(Long idItinerario);
}
