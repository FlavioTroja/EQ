package it.overzoom.eq.calendar.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/calendar")
public class HelloWorld {

    @Value("${message.welcome}")
    private String message;

    @Value("${server.instance.id}")
    private String instanceId;

    @GetMapping("/hello")
    public String hello() {
        return "Hello " + instanceId;
    }

    @GetMapping("/message")
    public String message() {
        return message;
    }

}
