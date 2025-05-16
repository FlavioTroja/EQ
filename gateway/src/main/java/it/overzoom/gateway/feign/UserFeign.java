package it.overzoom.gateway.feign;

import java.net.URISyntaxException;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

import it.overzoom.gateway.dto.UserDto;
import jakarta.ws.rs.BadRequestException;

@FeignClient(name = "registry", url = "registry:8080")
public interface UserFeign {

    @PostMapping("/api/registry/users")
    public ResponseEntity<UserDto> create(UserDto userDto) throws BadRequestException, URISyntaxException;
}
