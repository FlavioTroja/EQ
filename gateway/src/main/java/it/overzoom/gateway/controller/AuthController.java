package it.overzoom.gateway.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final RestTemplate restTemplate;
    private final String keycloakUrl;
    private final String realm;
    private final String clientId;

    public AuthController(
            @Value("${keycloak.auth-server-url}") String keycloakUrl,
            @Value("${keycloak.realm}") String realm,
            @Value("${keycloak.resource}") String clientId) {
        this.restTemplate = new RestTemplate();
        this.keycloakUrl = keycloakUrl;
        this.realm = realm;
        this.clientId = clientId;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam("username") String username,
            @RequestParam("password") String password) {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("username", username);
        formData.add("password", password);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> jsonMap = mapper.readValue(response.getBody(),
                    new TypeReference<Map<String, Object>>() {
                    });
            return ResponseEntity.status(response.getStatusCode()).body(jsonMap);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Errore nella conversione del JSON");
        }
    }

    /**
     * Endpoint per il refresh token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "refresh_token");
        formData.add("client_id", clientId);
        formData.add("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    /**
     * Endpoint per il logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam String refreshToken) {
        String logoutUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/logout";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("refresh_token", refreshToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(logoutUrl, request, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }

    /**
     * Endpoint per la registrazione di un nuovo utente
     * (attenzione: in Keycloak la registrazione richiede impostazioni particolari
     * e/o l'utilizzo delle API admin)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registrationData) {
        // Per esempio, se hai abilitato self-registration in Keycloak, potresti avere
        // un endpoint dedicato.
        // Altrimenti, per registrare un utente via API admin, occorre procurarsi un
        // token admin e usare le API admin.
        // In questo esempio si ipotizza un endpoint per la registrazione (da
        // personalizzare secondo le tue esigenze).

        String registrationUrl = UriComponentsBuilder
                .fromHttpUrl(keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/registrations")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(registrationData, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(registrationUrl, request, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
