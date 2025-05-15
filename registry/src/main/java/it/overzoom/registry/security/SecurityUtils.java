package it.overzoom.registry.security;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import it.overzoom.registry.exception.ResourceNotFoundException;

public class SecurityUtils {

    public static String getCurrentUserId() throws ResourceNotFoundException {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(auth -> auth.getPrincipal() instanceof Jwt)
                .map(auth -> (Jwt) auth.getPrincipal())
                .map(jwt -> (String) jwt.getClaim("sub"))
                .orElseThrow(() -> new ResourceNotFoundException("Utente non autenticato."));
    }

    public static boolean isCurrentUser(String userId) throws ResourceNotFoundException {
        String currentUserId = getCurrentUserId();
        return currentUserId.equals(userId);
    }

    public static boolean isAdmin() throws ResourceNotFoundException {
        Jwt jwt = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(auth -> auth.getPrincipal() instanceof Jwt)
                .map(auth -> (Jwt) auth.getPrincipal())
                .orElseThrow(() -> new ResourceNotFoundException("Utente non autenticato."));

        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");

        if (resourceAccess != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> clientMap = (Map<String, Object>) resourceAccess.get("eq-project");
            if (clientMap != null) {
                @SuppressWarnings("unchecked")
                List<String> roles = (List<String>) clientMap.get("roles");
                return roles != null && roles.contains("admin");
            }
        }

        return false;
    }
}
