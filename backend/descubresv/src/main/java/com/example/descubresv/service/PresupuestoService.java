package com.example.descubresv.service;

import com.example.descubresv.dto.request.PresupuestoRequest;
import com.example.descubresv.dto.response.PresupuestoResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Itinerario;
import com.example.descubresv.model.entity.Presupuesto;
import com.example.descubresv.repository.ItinerarioRepository;
import com.example.descubresv.repository.PresupuestoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

// Servicio para gestionar el presupuesto de un itinerario
@Service
@SuppressWarnings("null")
public class PresupuestoService {

    private final PresupuestoRepository presupuestoRepository;
    private final ItinerarioRepository itinerarioRepository;

    public PresupuestoService(PresupuestoRepository presupuestoRepository,
            ItinerarioRepository itinerarioRepository) {
        this.presupuestoRepository = presupuestoRepository;
        this.itinerarioRepository = itinerarioRepository;
    }

    // Obtiene el presupuesto de un itinerario
    public PresupuestoResponse obtenerPorItinerario(Long userId, Long idItinerario) {
        validarItinerarioDelUsuario(userId, idItinerario);

        Presupuesto presupuesto = presupuestoRepository.findByItinerarioIdItinerario(idItinerario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Este itinerario aun no tiene presupuesto"));

        return PresupuestoResponse.fromEntity(presupuesto);
    }

    // Crea o actualiza el presupuesto de un itinerario, calcula el total
    public PresupuestoResponse guardar(Long userId, Long idItinerario, PresupuestoRequest request) {
        Itinerario itinerario = validarItinerarioDelUsuario(userId, idItinerario);

        Presupuesto presupuesto = presupuestoRepository.findByItinerarioIdItinerario(idItinerario)
                .orElse(Presupuesto.builder().itinerario(itinerario).build());

        BigDecimal transporte = valorOCero(request.getCostoTransporte());
        BigDecimal alimentacion = valorOCero(request.getCostoAlimentacion());
        BigDecimal entrada = valorOCero(request.getCostoEntrada());
        BigDecimal otros = valorOCero(request.getCostoOtros());

        presupuesto.setCostoTransporte(transporte);
        presupuesto.setCostoAlimentacion(alimentacion);
        presupuesto.setCostoEntrada(entrada);
        presupuesto.setCostoOtros(otros);
        presupuesto.setTotal(transporte.add(alimentacion).add(entrada).add(otros));

        presupuesto = presupuestoRepository.save(presupuesto);
        return PresupuestoResponse.fromEntity(presupuesto);
    }

    // Retorna el valor o cero si es null
    private BigDecimal valorOCero(BigDecimal valor) {
        return valor != null ? valor : BigDecimal.ZERO;
    }

    // Valida que el itinerario exista y sea del usuario autenticado
    private Itinerario validarItinerarioDelUsuario(Long userId, Long idItinerario) {
        Itinerario itinerario = itinerarioRepository.findById(idItinerario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Itinerario no encontrado con id: " + idItinerario));

        if (!itinerario.getUsuario().getIdUsuario().equals(userId)) {
            throw new BadRequestException("Este itinerario no te pertenece");
        }

        return itinerario;
    }
}
