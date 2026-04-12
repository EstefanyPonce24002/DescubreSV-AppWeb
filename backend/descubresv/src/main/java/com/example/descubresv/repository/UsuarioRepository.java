package com.example.descubresv.repository;

// ===== IMPORTACIONES =====

// Entidad Usuario (tabla en la BD)
import com.example.descubresv.model.entity.Usuario;

// Enum para roles (ADMIN, TURISTA, etc.)
import com.example.descubresv.model.enums.RolUsuario;

// Clases para paginación
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// JpaRepository: interfaz base de Spring Data JPA para CRUD automático
import org.springframework.data.jpa.repository.JpaRepository;

// Marca esta interfaz como componente de persistencia
import org.springframework.stereotype.Repository;

// Para manejar valores opcionales (evitar null)
import java.util.Optional;


// ===== REPOSITORIO =====
// Este repositorio maneja el acceso a la tabla Usuario
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // ===== BUSCAR POR CORREO =====
    // Retorna un Optional porque puede o no existir el usuario
    // se usado para login o validación de duplicados
    Optional<Usuario> findByCorreo(String correo);


    // ===== VERIFICAR SI EXISTE UN CORREO =====
    // Retorna true si ya hay un usuario con ese correo
    // Es ideal para validaciones antes de crear usuario
    boolean existsByCorreo(String correo);


    // ===== FILTRAR POR ROL (CON PAGINACIÓN) =====
    // Permite obtener usuarios por tipo (ADMIN, TURISTA, etc.)
    // Pageable permite controlar página, tamaño y orden
    Page<Usuario> findByRol(RolUsuario rol, Pageable pageable);


    // ===== FILTRAR POR ESTADO (ACTIVO / INACTIVO) =====
    // Útil para soft delete (usuarios desactivados)
    Page<Usuario> findByActivo(Boolean activo, Pageable pageable);

}