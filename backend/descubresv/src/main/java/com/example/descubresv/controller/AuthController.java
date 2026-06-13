package com.example.descubresv.controller;

import com.example.descubresv.dto.request.LoginRequest;
import com.example.descubresv.dto.request.RegisterRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.AuthResponse;
import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.security.JwtService;
import com.example.descubresv.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "AUTENTICACION", description = "Login, registro, logout y perfil del usuario autenticado")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Autentica un usuario y devuelve una cookie JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        Usuario usuario = authService.login(request);
        String token = jwtService.generarToken(usuario.getIdUsuario(), usuario.getCorreo(), usuario.getRol());
        response.addCookie(jwtService.crearCookieJwt(token));

        return ResponseEntity.ok(
                ApiResponse.success("Login exitoso", AuthResponse.fromEntity(usuario, token)));
    }

    @PostMapping("/register")
    @Operation(summary = "Registro", description = "Registra un nuevo turista y devuelve una cookie JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> registrar(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        Usuario usuario = authService.registrar(request);
        String token = jwtService.generarToken(usuario.getIdUsuario(), usuario.getCorreo(), usuario.getRol());
        response.addCookie(jwtService.crearCookieJwt(token));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registro exitoso", AuthResponse.fromEntity(usuario, token)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Elimina la cookie JWT de la sesion")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        response.addCookie(jwtService.crearCookieLogout());
        return ResponseEntity.ok(ApiResponse.success("Sesion cerrada exitosamente", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Perfil actual", description = "Devuelve datos del usuario autenticado")
    public ResponseEntity<ApiResponse<AuthResponse>> perfilActual(Authentication authentication) {
        Long userId = (Long) authentication.getDetails();
        AuthResponse perfil = authService.obtenerPerfilActual(userId);
        return ResponseEntity.ok(ApiResponse.success(perfil));
    }
}
