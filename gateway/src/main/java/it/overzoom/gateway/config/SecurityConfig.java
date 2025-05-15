package it.overzoom.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(Customizer.withDefaults())
                                .authorizeExchange(authz -> authz
                                                .pathMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                                                .pathMatchers("/login**", "/oauth2/**").permitAll()
                                                .anyExchange().authenticated())
                                // abilita il login OIDC
                                .oauth2Login(Customizer.withDefaults())
                                // abilita il client OAuth2 (per TokenRelay)
                                .oauth2Client(Customizer.withDefaults())
                                // abilita il resource server (JWT valida)
                                .oauth2ResourceServer(rs -> rs.jwt(Customizer.withDefaults()));

                return http.build();
        }
}
