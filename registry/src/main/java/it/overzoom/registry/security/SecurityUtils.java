package it.overzoom.registry.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import it.overzoom.registry.dto.UserDTO;
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

        var roles = jwt.getClaimAsStringList("roles");
        return roles != null && roles.contains("admin");
    }

    public static UserDTO populateKeycloakFields(UserDTO userDTO) throws ResourceNotFoundException {
        Jwt jwt = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(auth -> auth.getPrincipal() instanceof Jwt)
                .map(auth -> (Jwt) auth.getPrincipal())
                .orElseThrow(() -> new ResourceNotFoundException("Utente non autenticato."));

        userDTO.setUsername(jwt.getClaimAsString("preferred_username"));
        userDTO.setFirstName(jwt.getClaimAsString("given_name"));
        userDTO.setLastName(jwt.getClaimAsString("family_name"));
        userDTO.setEmail(jwt.getClaimAsString("email"));

        Object resourceAccessObj = jwt.getClaim("resource_access");
        if (resourceAccessObj instanceof Map) {
            Map<?, ?> resourceAccess = (Map<?, ?>) resourceAccessObj;
            Object eqProjectObj = resourceAccess.get("eq-project");
            if (eqProjectObj instanceof Map) {
                Map<?, ?> eqProject = (Map<?, ?>) eqProjectObj;
                Object rolesObj = eqProject.get("roles");
                if (rolesObj instanceof List<?>) {
                    List<?> rolesList = (List<?>) rolesObj;
                    List<String> rolesStringList = new ArrayList<>();
                    for (Object role : rolesList) {
                        if (role instanceof String) {
                            rolesStringList.add((String) role);
                        }
                    }
                    userDTO.setRoles(rolesStringList.toArray(new String[0]));
                }
            }
        }

        return userDTO;
    }
}
