package com.example.bookexchange.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/api/demo/hello")
    public String hello() {
        return "Hello! Spring Boot with Gradle is running!";
    }
}
