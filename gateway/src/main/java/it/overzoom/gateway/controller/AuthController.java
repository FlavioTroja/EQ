package it.overzoom.gateway.controller;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CognitoIdentityProviderClient cognito;
    private final String clientId;
    private final String clientSecret;

    public AuthController(
            CognitoIdentityProviderClient cognito,
            @Value("${cognito.client-id}") String clientId,
            @Value("${cognito.client-secret}") String clientSecret) {
        this.cognito = cognito;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // calcola la SECRET_HASH
        String secretHash = calculateSecretHash(
                req.username, clientId, clientSecret);

        InitiateAuthRequest authReq = InitiateAuthRequest.builder()
                .authFlow(AuthFlowType.USER_PASSWORD_AUTH)
                .clientId(clientId)
                .authParameters(Map.of(
                        "USERNAME", req.username,
                        "PASSWORD", req.password,
                        "SECRET_HASH", secretHash))
                .build();

        InitiateAuthResponse resp = cognito.initiateAuth(authReq);
        AuthenticationResultType tok = resp.authenticationResult();
        return ResponseEntity.ok(Map.of(
                "access_token", tok.accessToken(),
                "id_token", tok.idToken(),
                "refresh_token", tok.refreshToken(),
                "expires_in", tok.expiresIn()));
    }

    private static String calculateSecretHash(String userName,
            String clientId,
            String clientSecret) {
        try {
            String HMAC_SHA256_ALGORITHM = "HmacSHA256";
            SecretKeySpec signingKey = new SecretKeySpec(
                    clientSecret.getBytes(StandardCharsets.UTF_8),
                    HMAC_SHA256_ALGORITHM);
            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
            mac.init(signingKey);
            String data = userName + clientId;
            byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating secret hash", e);
        }
    }
}
