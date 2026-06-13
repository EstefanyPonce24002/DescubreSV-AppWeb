package com.example.descubresv.config;

import com.example.descubresv.model.entity.Usuario;
import com.example.descubresv.model.enums.RolUsuario;
import com.example.descubresv.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "rm24082@ues.edu.sv";
        if (!usuarioRepository.existsByCorreo(adminEmail)) {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador")
                    .correo(adminEmail)
                    .passwordHash(passwordEncoder.encode("admin@2026"))
                    .rol(RolUsuario.ADMIN)
                    .activo(true)
                    .presupuestoEstimado(BigDecimal.ZERO)
                    .build();
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador creado con exito: " + adminEmail);
        } else {
            Usuario admin = usuarioRepository.findByCorreo(adminEmail).orElseThrow();
            admin.setPasswordHash(passwordEncoder.encode("admin@2026"));
            admin.setRol(RolUsuario.ADMIN);
            admin.setActivo(true);
            usuarioRepository.save(admin);
            System.out.println("Usuario administrador actualizado con exito: " + adminEmail);
        }
    }
}
