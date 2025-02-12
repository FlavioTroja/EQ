package it.overzoom.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http.authorizeExchange(exchange -> exchange
                .anyExchange().authenticated()).oauth2ResourceServer(oauth2 -> oauth2.jwt(_ -> {

                }));

        http.csrf(csrf -> csrf.disable());

        return http.build();
    }
}
