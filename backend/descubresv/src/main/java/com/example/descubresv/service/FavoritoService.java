package com.example.descubresv.service;

import com.example.descubresv.dto.request.FavoritoRequest;
import com.example.descubresv.dto.response.FavoritoResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Destino;
import com.example.descubresv.model.entity.Favorito;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.repository.DestinoRepository;
import com.example.descubresv.repository.FavoritoRepository;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DestinoRepository destinoRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository,
            DestinoRepository destinoRepository) {

        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.destinoRepository = destinoRepository;
    }

    public FavoritoResponse crear(Long userId, FavoritoRequest request) {

        if (favoritoRepository.existsByUsuarioIdUsuarioAndDestinoIdDestino(
                userId,
                request.getIdDestino())) {

            throw new BadRequestException("Este destino ya esta en favoritos");
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Destino destino = destinoRepository.findById(request.getIdDestino())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Destino no encontrado con id: " + request.getIdDestino()));

        Favorito favorito = Favorito.builder()
                .usuario(usuario)
                .destino(destino)
                .build();

        favorito = favoritoRepository.save(favorito);

        return FavoritoResponse.fromEntity(favorito);
    }

    public Page<FavoritoResponse> listarMisFavoritos(Long userId, Pageable pageable) {
        return favoritoRepository.findByUsuarioIdUsuario(userId, pageable)
                .map(FavoritoResponse::fromEntity);
    }

    public void eliminar(Long userId, Long idFavorito) {

        Favorito favorito = favoritoRepository.findById(idFavorito)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Favorito no encontrado con id: " + idFavorito));

        if (!favorito.getUsuario().getIdUsuario().equals(userId)) {
            throw new BadRequestException(
                    "No puedes eliminar un favorito que no te pertenece");
        }

        favoritoRepository.delete(favorito);
    }
}