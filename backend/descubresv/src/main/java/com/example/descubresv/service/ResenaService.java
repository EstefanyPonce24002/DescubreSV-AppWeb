package com.example.descubresv.service;

import com.example.descubresv.dto.request.ResenaRequest;
import com.example.descubresv.dto.response.ResenaResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.model.entity.Resena;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.repository.DestinoRepository;
import com.example.descubresv.repository.ResenaRepository;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

// Servicio para gestionar resenas de destinos turisticos
@Service
@SuppressWarnings("null")
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;

    public ResenaService(ResenaRepository resenaRepository,
            UsuarioRepository usuarioRepository,
            DestinoRepository destinoRepository) {
        this.resenaRepository = resenaRepository;
        this.usuarioRepository = usuarioRepository;
        this.destinoRepository = destinoRepository;
    }

    // Crea una resena para un destino con el usuario autenticado
    public ResenaResponse crear(Long userId, ResenaRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Destino no encontrado con id: " + request.getIdDestino()));

        Resena resena = Resena.builder()
                .usuario(usuario)
                .destino(destino)
                .calificacion(request.getCalificacion())
                .comentario(request.getComentario())
                .build();

        resena = resenaRepository.save(resena);
        return ResenaResponse.fromEntity(resena);
    }

    // Lista resenas de un destino, acceso publico
    public Page<ResenaResponse> listarPorDestino(Long idDestino, Pageable pageable) {
        return resenaRepository.findByDestinoIdDestino(idDestino, pageable)
                .map(ResenaResponse::fromEntity);
    }

    // Lista las resenas del usuario autenticado
    public Page<ResenaResponse> listarMisResenas(Long userId, Pageable pageable) {
        return resenaRepository.findByUsuarioIdUsuario(userId, pageable)
                .map(ResenaResponse::fromEntity);
    }

    // Elimina una resena, solo si pertenece al usuario autenticado
    public void eliminar(Long userId, Long idResena) {
        Resena resena = resenaRepository.findById(idResena)
                .orElseThrow(() -> new ResourceNotFoundException("Resena no encontrada con id: " + idResena));

        if (!resena.getUsuario().getIdUsuario().equals(userId)) {
            throw new BadRequestException("No puedes eliminar una resena que no te pertenece");
        }

        resenaRepository.delete(resena);
    }
}
