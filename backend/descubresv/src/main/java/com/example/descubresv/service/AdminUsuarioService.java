package com.example.descubresv.service;

import com.example.descubresv.dto.request.AdminUsuarioRequest;
import com.example.descubresv.dto.response.UsuarioResponse;
import com.example.descubresv.exception.BadRequestException;
import com.example.descubresv.exception.EmailAlreadyExistsException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private void verificarPermisoRol(RolUsuario rolObjetivo) {
        if (rolObjetivo == RolUsuario.ADMIN) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                throw new BadRequestException("Solo los administradores pueden asignar el rol ADMIN.");
            }
        }
    }

    @Transactional(readOnly = true)
    public Page<UsuarioResponse> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(UsuarioResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));
        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional
    public UsuarioResponse crear(AdminUsuarioRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new EmailAlreadyExistsException("Ya existe un usuario con el correo: " + request.getCorreo());
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("La contraseña es obligatoria");
        }

        verificarPermisoRol(request.getRol());

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nacionalidad(request.getNacionalidad())
                .preferencias(request.getPreferencias())
                .presupuestoEstimado(request.getPresupuestoEstimado())
                .avatarUrl(request.getAvatarUrl())
                .rol(request.getRol() != null ? request.getRol() : RolUsuario.TURISTA)
                .activo(request.getActivo() != null ? request.getActivo() : true)
                .build();

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse actualizar(Long id, AdminUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        if (!usuario.getCorreo().equals(request.getCorreo()) &&
                usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new EmailAlreadyExistsException("Ya existe otro usuario con el correo: " + request.getCorreo());
        }

        verificarPermisoRol(request.getRol());

        usuario.setNombre(request.getNombre());
        usuario.setCorreo(request.getCorreo());
        usuario.setNacionalidad(request.getNacionalidad());
        usuario.setPreferencias(request.getPreferencias());
        usuario.setPresupuestoEstimado(request.getPresupuestoEstimado());
        usuario.setAvatarUrl(request.getAvatarUrl());
        usuario.setRol(request.getRol() != null ? request.getRol() : usuario.getRol());

        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        usuarioRepository.delete(usuario);
    }
}