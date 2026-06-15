package com.example.descubresv.controller;

import com.example.descubresv.dto.request.UsuarioRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.UsuarioResponse;
import com.example.descubresv.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "USUARIOS", description = "Gestion de perfiles de usuario")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar usuarios")
    public ResponseEntity<ApiResponse<PageResponse<UsuarioResponse>>> listar(Pageable pageable) {
        PageResponse<UsuarioResponse> usuarios = PageResponse.of(usuarioService.listar(pageable));
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de usuario")
    public ResponseEntity<ApiResponse<UsuarioResponse>> obtenerPorId(
            @PathVariable Long id,
            Authentication authentication) {
        validarPropietarioOAdmin(id, authentication);
        UsuarioResponse usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success(usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<ApiResponse<UsuarioResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest request,
            Authentication authentication) {
        validarPropietarioOAdmin(id, authentication);

        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!esAdmin) {
            request.setRol(null);
            request.setActivo(null);
        }

        UsuarioResponse usuario = usuarioService.actualizar(id, request);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", usuario));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar usuario")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }

    private void validarPropietarioOAdmin(Long id, Authentication authentication) {
        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (esAdmin) {
            return;
        }
        Long userId = (Long) ((UsernamePasswordAuthenticationToken) authentication).getDetails();
        if (!id.equals(userId)) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }
    }
}
