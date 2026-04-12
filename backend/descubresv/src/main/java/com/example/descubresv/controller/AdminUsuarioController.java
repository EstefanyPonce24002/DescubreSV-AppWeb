package com.example.descubresv.controller;

// ===== IMPORTACIONES =====
// DTOs de entrada y salida (para no exponer entidades directamente)
import com.example.descubresv.dto.request.AdminUsuarioRequest;
import com.example.descubresv.dto.response.ApiResponse;
import com.example.descubresv.dto.response.PageResponse;
import com.example.descubresv.dto.response.UsuarioResponse;

// Servicio donde está la lógica de negocio
import com.example.descubresv.service.AdminUsuarioService;

// Anotaciones para documentación Swagger
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

// Validaciones automáticas de los datos de entrada
import jakarta.validation.Valid;

// Paginación de Spring
import org.springframework.data.domain.Pageable;

// Manejo de respuestas HTTP
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Anotaciones REST
import org.springframework.web.bind.annotation.*;


// ===== CONTROLADOR REST =====
// Indica que esta clase maneja endpoints REST
@RestController

// Ruta base para todos los endpoints de este controlador
@RequestMapping("/api/admin/usuarios")

// Etiqueta para Swagger (documentación de la API)
@Tag(name = "Admin - Usuarios", description = "Gestión de usuarios por el administrador")
public class AdminUsuarioController {

    // ===== INYECCIÓN DE DEPENDENCIAS =====
    // Servicio que contiene la lógica (CRUD de usuarios)
    private final AdminUsuarioService adminUsuarioService;

    // Constructor para inyectar el servicio (inyección por constructor)
    public AdminUsuarioController(AdminUsuarioService adminUsuarioService) {
        this.adminUsuarioService = adminUsuarioService;
    }


    // ===== LISTAR USUARIOS =====
    @GetMapping
    @Operation(summary = "Listar usuarios", description = "Lista todos los usuarios con paginación")
    public ResponseEntity<ApiResponse<PageResponse<UsuarioResponse>>> listar(Pageable pageable) {

        // Llama al servicio para obtener los usuarios paginados
        PageResponse<UsuarioResponse> usuarios =
                PageResponse.of(adminUsuarioService.listar(pageable));

        // Retorna respuesta HTTP 200 OK con estructura estándar
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }


    // ===== OBTENER USUARIO POR ID =====
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario", description = "Obtiene el detalle de un usuario por su id")
    public ResponseEntity<ApiResponse<UsuarioResponse>> obtenerPorId(@PathVariable Long id) {

        // Busca el usuario por ID (si no existe, normalmente el service lanza excepción)
        UsuarioResponse usuario = adminUsuarioService.buscarPorId(id);

        // Retorna respuesta con el usuario encontrado
        return ResponseEntity.ok(ApiResponse.success(usuario));
    }


    // ===== CREAR USUARIO =====
    @PostMapping
    @Operation(summary = "Crear usuario", description = "Crea un nuevo usuario (ADMIN o TURISTA)")
    public ResponseEntity<ApiResponse<UsuarioResponse>> crear(

            // @Valid valida automáticamente el DTO según anotaciones (ej: @NotNull, @Email)
            @Valid @RequestBody AdminUsuarioRequest request) {

        // Llama al servicio para crear el usuario
        UsuarioResponse usuario = adminUsuarioService.crear(request);

        // Retorna HTTP 201 CREATED con mensaje personalizado
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Usuario creado exitosamente", usuario));
    }


    // ===== ACTUALIZAR USUARIO =====
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente")
    public ResponseEntity<ApiResponse<UsuarioResponse>> actualizar(

            // ID del usuario a actualizar
            @PathVariable Long id,

            // Datos nuevos del usuario
            @Valid @RequestBody AdminUsuarioRequest request) {

        // Llama al servicio para actualizar
        UsuarioResponse usuario = adminUsuarioService.actualizar(id, request);

        // Retorna respuesta con mensaje
        return ResponseEntity.ok(
                ApiResponse.success("Usuario actualizado exitosamente", usuario));
    }


    // ===== ELIMINAR (DESACTIVACIÓN LÓGICA) =====
    @DeleteMapping("/{id}")
    @Operation(summary = "Desactivar usuario", description = "Desactiva lógicamente un usuario")
    public ResponseEntity<ApiResponse<String>> eliminar(@PathVariable Long id) {

        // No elimina físicamente en BD, solo cambia estado (ej: activo = false)
        adminUsuarioService.eliminar(id);

        // Retorna confirmación
        return ResponseEntity.ok(
                ApiResponse.success("Usuario desactivado exitosamente", null));
    }
}