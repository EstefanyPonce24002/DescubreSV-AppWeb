package com.example.descubresv.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("DescubreSV API")
                .description("Guía digital interactiva para turistas que permite planificar itinerarios y presupuestos, integrando rutas, transporte y destinos de El Salvador en una sola plataforma web.")
                .version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList("Bearer JWT"))
            .components(new Components().addSecuritySchemes("Bearer JWT", 
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
