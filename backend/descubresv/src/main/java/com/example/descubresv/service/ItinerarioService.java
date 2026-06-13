package com.example.descubresv.service;

import com.example.descubresv.dto.request.ItinerarioDestinoRequest;
import com.example.descubresv.dto.request.ItinerarioRequest;
import com.example.descubresv.dto.response.ItinerarioDestinoResponse;
import com.example.descubresv.dto.response.ItinerarioResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.model.entity.Itinerario;
import com.example.descubresv.model.entity.ItinerarioDestino;
import com.example.descubresv.model.entity.ItinerarioDestinoId;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.repository.DestinoRepository;
import com.example.descubresv.repository.ItinerarioDestinoRepository;
import com.example.descubresv.repository.ItinerarioRepository;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Servicio para gestionar itinerarios de viaje del turista
@Service
@SuppressWarnings("null")
public class ItinerarioService {

    private final ItinerarioRepository itinerarioRepository;
    private final ItinerarioDestinoRepository itinerarioDestinoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;

    public ItinerarioService(ItinerarioRepository itinerarioRepository,
            ItinerarioDestinoRepository itinerarioDestinoRepository,
            UsuarioRepository usuarioRepository,
            DestinoRepository destinoRepository) {
        this.itinerarioRepository = itinerarioRepository;
        this.itinerarioDestinoRepository = itinerarioDestinoRepository;
        this.usuarioRepository = usuarioRepository;
        this.destinoRepository = destinoRepository;
    }

    // Lista los itinerarios activos del usuario autenticado
    public Page<ItinerarioResponse> listarMisItinerarios(Long userId, Pageable pageable) {
        return itinerarioRepository.findByUsuarioIdUsuarioAndActivo(userId, true, pageable)
                .map(ItinerarioResponse::fromEntity);
    }

    // Obtiene un itinerario con sus destinos, valida que sea del usuario
    public ItinerarioResponse obtenerPorId(Long userId, Long idItinerario) {
        Itinerario itinerario = buscarItinerarioDelUsuario(userId, idItinerario);

        List<ItinerarioDestinoResponse> destinos = itinerarioDestinoRepository
                .findByItinerarioIdItinerarioOrderByDiaNumeroAscOrdenAsc(idItinerario)
                .stream()
                .map(ItinerarioDestinoResponse::fromEntity)
                .collect(Collectors.toList());

        return ItinerarioResponse.fromEntityConDestinos(itinerario, destinos);
    }

    // Crea un nuevo itinerario para el usuario autenticado
    public ItinerarioResponse crear(Long userId, ItinerarioRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Itinerario itinerario = Itinerario.builder()
                .usuario(usuario)
                .nombre(request.getNombre())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .duracion(request.getDuracion())
                .presupuestoCategoria(request.getPresupuestoCategoria())
                .tipoExperiencia(request.getTipoExperiencia())
                .tipoGrupo(request.getTipoGrupo())
                .modoPlanificacion(request.getModoPlanificacion())
                .activo(true)
                .build();

        itinerario = itinerarioRepository.save(itinerario);
        return ItinerarioResponse.fromEntity(itinerario);
    }

    // Actualiza un itinerario existente del usuario
    public ItinerarioResponse actualizar(Long userId, Long idItinerario, ItinerarioRequest request) {
        Itinerario itinerario = buscarItinerarioDelUsuario(userId, idItinerario);

        itinerario.setNombre(request.getNombre());
        itinerario.setFechaInicio(request.getFechaInicio());
        itinerario.setFechaFin(request.getFechaFin());
        itinerario.setDuracion(request.getDuracion());
        itinerario.setPresupuestoCategoria(request.getPresupuestoCategoria());
        itinerario.setTipoExperiencia(request.getTipoExperiencia());
        itinerario.setTipoGrupo(request.getTipoGrupo());
        itinerario.setModoPlanificacion(request.getModoPlanificacion());

        itinerario = itinerarioRepository.save(itinerario);
        return ItinerarioResponse.fromEntity(itinerario);
    }

    // Desactiva un itinerario del usuario
    public void eliminar(Long userId, Long idItinerario) {
        Itinerario itinerario = buscarItinerarioDelUsuario(userId, idItinerario);
        itinerario.setActivo(false);
        itinerarioRepository.save(itinerario);
    }

    // Agrega un destino al itinerario del usuario
    public ItinerarioDestinoResponse agregarDestino(Long userId, Long idItinerario,
            ItinerarioDestinoRequest request) {
        Itinerario itinerario = buscarItinerarioDelUsuario(userId, idItinerario);

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Destino no encontrado con id: " + request.getIdDestino()));

        ItinerarioDestino itinerarioDestino = ItinerarioDestino.builder()
                .itinerario(itinerario)
                .destino(destino)
                .diaNumero(request.getDiaNumero())
                .orden(request.getOrden())
                .notas(request.getNotas())
                .build();

        itinerarioDestino = itinerarioDestinoRepository.save(itinerarioDestino);
        return ItinerarioDestinoResponse.fromEntity(itinerarioDestino);
    }

    // Quita un destino del itinerario del usuario
    public void quitarDestino(Long userId, Long idItinerario, Long idDestino) {
        buscarItinerarioDelUsuario(userId, idItinerario);

        ItinerarioDestinoId id = new ItinerarioDestinoId(idItinerario, idDestino);
        if (!itinerarioDestinoRepository.existsById(id)) {
            throw new ResourceNotFoundException("El destino no esta en este itinerario");
        }

        itinerarioDestinoRepository.deleteById(id);
    }

    // Busca un itinerario y valida que pertenezca al usuario
    private Itinerario buscarItinerarioDelUsuario(Long userId, Long idItinerario) {
        Itinerario itinerario = itinerarioRepository.findById(idItinerario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Itinerario no encontrado con id: " + idItinerario));

        if (!itinerario.getUsuario().getIdUsuario().equals(userId)) {
            throw new BadRequestException("Este itinerario no te pertenece");
        }

        return itinerario;
    }
}
