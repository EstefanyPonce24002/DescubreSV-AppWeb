package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repositorio de presupuestos
@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    Optional<Presupuesto> findByItinerarioIdItinerario(Long idItinerario);
}
