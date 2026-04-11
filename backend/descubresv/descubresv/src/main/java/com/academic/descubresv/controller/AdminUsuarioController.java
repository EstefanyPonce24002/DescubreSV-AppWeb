// Paquete donde se ubica la clase (organización del proyecto)
package com.academic.descubresv.controller;

// Importaciones de DTOs (objetos de transferencia de datos) para request y response
import com.academic.descubresv.dto.request.AdminUsuarioRequest;
import com.academic.descubresv.dto.response.ApiResponse;
import com.academic.descubresv.dto.response.PageResponse;
import com.academic.descubresv.dto.response.UsuarioResponse;

// Importación del servicio que contiene la lógica de negocio
import com.academic.descubresv.service.AdminUsuarioService;

// Swagger/OpenAPI para documentar los endpoints
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

// Validaciones con Jakarta
import jakarta.validation.Valid;

// Utilidades de Spring para paginación y respuestas HTTP
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Anotación que indica que esta clase es un controlador REST
@RestController
// Prefijo común para todos los endpoints de este controlador
@RequestMapping("/api/admin/usuarios")
// Etiqueta para la documentación de Swagger
@Tag(name = "Admin - Usuarios", description = "Gestión de usuarios por el administrador")
public class AdminUsuarioController {

    // Inyección del servicio que maneja la lógica de usuarios
    private final AdminUsuarioService adminUsuarioService;

    // Constructor para inicializar el servicio
    public AdminUsuarioController(AdminUsuarioService adminUsuarioService) {
        this.adminUsuarioService = adminUsuarioService;
    }

    // ------------------- ENDPOINTS -------------------

    // GET: Listar usuarios con paginación
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Lista todos los usuarios con paginación")
    public ResponseEntity<ApiResponse<PageResponse<UsuarioResponse>>> listar(Pageable pageable) {
        // Se obtiene la lista paginada desde el servicio
        PageResponse<UsuarioResponse> usuarios = PageResponse.of(adminUsuarioService.listar(pageable));
        // Se envuelve en ApiResponse y se retorna con código 200 OK
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }

    // GET: Obtener un usuario por su ID
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene el detalle de un usuario por su id")
    public ResponseEntity<ApiResponse<UsuarioResponse>> obtenerPorId(@PathVariable Long id) {
        // Se busca el usuario en el servicio
        UsuarioResponse usuario = adminUsuarioService.buscarPorId(id);
        // Se retorna el usuario envuelto en ApiResponse
        return ResponseEntity.ok(ApiResponse.success(usuario));
    }

    // POST: Crear un nuevo usuario
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario (ADMIN o TURISTA)")
    public ResponseEntity<ApiResponse<UsuarioResponse>> crear(
            @Valid @RequestBody AdminUsuarioRequest request) {
        // Se crea el usuario con los datos recibidos
        UsuarioResponse usuario = adminUsuarioService.crear(request);
        // Se retorna con código 201 CREATED y mensaje de éxito
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario creado exitosamente", usuario));
    }

    // PUT: Actualizar un usuario existente
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    public ResponseEntity<ApiResponse<UsuarioResponse>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AdminUsuarioRequest request) {
        // Se actualiza el usuario en el servicio
        UsuarioResponse usuario = adminUsuarioService.actualizar(id, request);
        // Se retorna con mensaje de éxito
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado exitosamente", usuario));
    }

    // DELETE: Desactivar (eliminar lógicamente) un usuario
    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar usuario", description = "Desactiva lógicamente un usuario")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {
        // Se llama al servicio para desactivar el usuario
        adminUsuarioService.eliminar(id);
        // Se retorna mensaje de éxito
        return ResponseEntity.ok(ApiResponse.success("Usuario desactivado exitosamente", null));
    }
}
