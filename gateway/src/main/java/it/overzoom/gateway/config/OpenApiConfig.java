package it.overzoom.gateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@OpenAPIDefinition(security = @SecurityRequirement(name = "BearerAuth"))
@SecurityScheme(name = "BearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
@Configuration
public class OpenApiConfig {

        @Bean
        public OpenAPI userOpenAPI(
                        @Value("${openapi.service.title}") String serviceTitle,
                        @Value("${openapi.service.version}") String serviceVersion,
                        @Value("${openapi.service.url}") String url) {
                return new OpenAPI()
                                .servers(List.of(new Server().url(url)))
                                .info(new Info().title(serviceTitle).version(serviceVersion))
                                .components(new Components()
                                                .addSecuritySchemes("BearerAuth",
                                                                new io.swagger.v3.oas.models.security.SecurityScheme()
                                                                                .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")))
                                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement()
                                                .addList("BearerAuth"));
        }
}
