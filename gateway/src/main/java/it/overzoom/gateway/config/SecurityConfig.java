package it.overzoom.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
                http.csrf(csrf -> csrf.disable())
                                .cors(Customizer.withDefaults())
                                .authorizeExchange(ex -> ex
                                                .pathMatchers("/auth/**", "swagger-ui.html", "/swagger-ui/**",
                                                                "/api-docs/**",
                                                                "/calendar/api-docs/**", "/registry/api-docs/**",
                                                                "/document/api-docs/**")
                                                .permitAll()

                                                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .anyExchange().authenticated())
                                .oauth2ResourceServer(rs -> rs.jwt(Customizer.withDefaults()))
                                .exceptionHandling(handling -> handling
                                                .authenticationEntryPoint(new CorsAuthenticationEntryPoint()));

                return http.build();
        }
}
