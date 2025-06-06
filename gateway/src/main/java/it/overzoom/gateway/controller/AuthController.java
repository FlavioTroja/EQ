package it.overzoom.gateway.controller;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.gateway.dto.UserDto;
import it.overzoom.gateway.feign.UserFeign;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthenticationResultType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InitiateAuthResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.InvalidPasswordException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameExistsException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final CognitoIdentityProviderClient cognito;
    private final String clientId;
    private final String clientSecret;
    private final UserFeign userFeign;
    private final String userPoolId;

    public AuthController(CognitoIdentityProviderClient cognito,
            @Value("${COGNITO_CLIENT_ID}") String clientId,
            @Value("${COGNITO_CLIENT_SECRET}") String clientSecret,
            @Value("${COGNITO_USER_POOL_ID}") String userPoolId,
            UserFeign userFeign) {
        this.cognito = cognito;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.userFeign = userFeign;
        this.userPoolId = userPoolId;
    }

    public static class LoginRequest {
        public String username;
        public String password;
    }

    public static class RegisterRequest {
        public String name;
        public String surname;
        public String email;
        public String password;
        public String confirmPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String secretHash = calculateSecretHash(
                req.username, clientId, clientSecret);
        log.info("Logging in user: {}", req.username);
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        log.info("Registering user: {}", req.email);
        if (!req.password.equals(req.confirmPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password and confirmPassword do not match"));
        }

        String secretHash = calculateSecretHash(req.email, clientId, clientSecret);

        try {
            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(clientId)
                    .username(req.email)
                    .password(req.password)
                    .secretHash(secretHash)
                    .userAttributes(
                            AttributeType.builder().name("given_name").value(req.name).build(),
                            AttributeType.builder().name("family_name").value(req.surname).build(),
                            AttributeType.builder().name("email").value(req.email).build())
                    .build();

            SignUpResponse signUpResponse = cognito.signUp(signUpRequest);

            // UUID Cognito (userSub)
            String userSub = signUpResponse.userSub();

            cognito.adminAddUserToGroup(builder -> builder
                    .userPoolId(userPoolId)
                    .username(req.email)
                    .groupName("ROLE_USER")
                    .build());

            UserDto userDto = new UserDto();
            userDto.setUserId(userSub);
            userDto.setEmail(req.email);
            userDto.setFirstName(req.name);
            userDto.setLastName(req.surname);
            userDto.setRoles(new String[] { "ROLE_USER" });

            ResponseEntity<UserDto> responseFromRegistry = userFeign.create(userDto);

            return ResponseEntity.ok(Map.of(
                    "userConfirmed", signUpResponse.userConfirmed(),
                    "userSub", userSub,
                    "registryUser", responseFromRegistry.getBody()));
        } catch (UsernameExistsException e) {
            return ResponseEntity.status(409).body(Map.of("error", "User already exists"));
        } catch (InvalidPasswordException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid password: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
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
