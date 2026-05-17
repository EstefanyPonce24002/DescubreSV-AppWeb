package com.example.descubresv.service;

import com.example.descubresv.dto.request.LoginRequest;
import com.example.descubresv.dto.request.RegisterRequest;
import com.example.descubresv.dto.response.AuthResponse;
import com.example.descubresv.exception.EmailAlreadyExistsException;
import com.example.descubresv.exception.ResourceNotFoundException;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public Usuario login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        if (!usuario.getActivo()) {
            throw new BadCredentialsException("La cuenta está desactivada");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new BadCredentialsException("Credenciales invalidas");
        }

        return usuario;
    }

    @Transactional
    public Usuario registrar(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new EmailAlreadyExistsException("Ya existe un usuario con el correo: " + request.getCorreo());
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nacionalidad(request.getNacionalidad())
                .preferencias(request.getPreferencias())
                .presupuestoEstimado(request.getPresupuestoEstimado())
                .avatarUrl(request.getAvatarUrl())
                .rol(RolUsuario.TURISTA)
                .activo(true)
                .build();

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public AuthResponse obtenerPerfilActual(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));

        return AuthResponse.fromEntity(usuario);
    }
}
