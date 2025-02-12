package it.overzoom.eq.calendar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.eq.calendar.dto.UserDto;
import it.overzoom.eq.calendar.feign.UserFeign;

@RestController
@RequestMapping("/api/calendar/users")
public class UserController {

    @Autowired
    private UserFeign userFeign;

    @RequestMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable(value = "id") String userId) {
        return userFeign.findById(userId);
    }

    @GetMapping("")
    public ResponseEntity<List<UserDto>> findAll(Pageable pageable) {
        return userFeign.findAll(pageable);
    }
}
