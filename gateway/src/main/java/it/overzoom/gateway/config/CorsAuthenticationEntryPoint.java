package it.overzoom.gateway.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;

import reactor.core.publisher.Mono;

public class CorsAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    @Override
    public Mono<Void> commence(org.springframework.web.server.ServerWebExchange exchange, AuthenticationException ex) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        // Prendi origine della richiesta per impostare Access-Control-Allow-Origin
        // dinamicamente
        String origin = exchange.getRequest().getHeaders().getOrigin();

        if (origin != null) {
            response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
        } else {
            // fallback generico (evita '*', se usi allowCredentials=true)
            response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "https://radpro.it");
        }

        response.getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        response.getHeaders().add(HttpHeaders.VARY, "Origin");

        return response.setComplete();
    }
}