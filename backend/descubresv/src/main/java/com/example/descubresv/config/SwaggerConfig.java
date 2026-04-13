package com.example.descubresv.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Contact;
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
                        .description("API RESTful para la plataforma de turismo en El Salvador. "
                                + "Permite a los turistas explorar destinos, crear itinerarios, "
                                + "calcular presupuestos y dejar resenas de sus experiencias.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipo DescubreSV")
                                .email("contacto@descubresv.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer JWT"))
                .components(new Components().addSecuritySchemes("Bearer JWT",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
