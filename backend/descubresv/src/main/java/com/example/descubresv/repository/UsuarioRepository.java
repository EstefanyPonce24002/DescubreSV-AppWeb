package com.example.descubresv.repository;

import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    Page<Usuario> findByRol(RolUsuario rol, Pageable pageable);

    Page<Usuario> findByActivo(Boolean activo, Pageable pageable);
}