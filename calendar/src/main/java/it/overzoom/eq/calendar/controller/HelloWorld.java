package it.overzoom.eq.calendar.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HelloWorld {
    
    @Value("${message.welcome}")
    private String message;

    @GetMapping("/hello")
    public String Hello() {
        return "Hello World!";
    }

    @GetMapping("/message")
    public String Message() {
        return message;
    }
    
}
