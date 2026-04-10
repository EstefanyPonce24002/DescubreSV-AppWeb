// Paquete donde se ubica la interfaz, según estructura de carpetas
package com.academic.descubresv.repository;

import com.academic.descubresv.model.entity.Usuario;   // Importa la entidad Usuario
import com.academic.descubresv.model.enums.RolUsuario; // Importa el enum de roles de usuario
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repositorio de usuarios - acceso a datos y consultas personalizadas
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca un usuario por su correo electrónico
    Optional<Usuario> findByCorreo(String correo);

    // Verifica si existe un usuario con un correo específico
    boolean existsByCorreo(String correo);

    // Devuelve una página de usuarios filtrados por rol (ADMIN, TURISTA, etc.)
    Page<Usuario> findByRol(RolUsuario rol, Pageable pageable);

    // Devuelve una página de usuarios filtrados por estado activo/inactivo
    Page<Usuario> findByActivo(Boolean activo, Pageable pageable);
}

