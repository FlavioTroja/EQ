package it.overzoom.eq.calendar.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import it.overzoom.eq.calendar.dto.UserDto;

@FeignClient(name = "registry", url = "localhost:8765")
public interface UserFeign {

    @RequestMapping("/api/registry/users/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable(value = "id") String userId);

    @GetMapping("/api/registry/users")
    public ResponseEntity<List<UserDto>> findAll(Pageable pageable);
}
