package com.example.descubresv.controller;

import com.example.descubresv.dto.request.AdminUsuarioRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.UsuarioResponse;
import com.example.descubresv.service.AdminUsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
@Tag(name = "ADMINISTRAR USUARIOS", description = "Gestión de usuarios por el administrador")
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    public AdminUsuarioController(AdminUsuarioService adminUsuarioService) {
        this.adminUsuarioService = adminUsuarioService;
    }

    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Lista todos los usuarios con paginación")
    public ResponseEntity<ApiResponse<PageResponse<UsuarioResponse>>> listar(Pageable pageable) {
        PageResponse<UsuarioResponse> usuarios = PageResponse.of(adminUsuarioService.listar(pageable));
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene el detalle de un usuario por su id")
    public ResponseEntity<ApiResponse<UsuarioResponse>> obtenerPorId(@PathVariable Long id) {
        UsuarioResponse usuario = adminUsuarioService.buscarPorId(id);
        return ResponseEntity.ok(ApiResponse.success(usuario));
    }

    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario (ADMIN o TURISTA)")
    public ResponseEntity<ApiResponse<UsuarioResponse>> crear(@Valid @RequestBody AdminUsuarioRequest request) {
        UsuarioResponse usuario = adminUsuarioService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario creado exitosamente", usuario));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    public ResponseEntity<ApiResponse<UsuarioResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AdminUsuarioRequest request) {
        UsuarioResponse usuario = adminUsuarioService.actualizar(id, request);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", usuario));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        adminUsuarioService.eliminar(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }
}