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
            .info(new Info().title("DescubreSV API").version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList("Bearer JWT"))
            .components(new Components().addSecuritySchemes("Bearer JWT", 
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
