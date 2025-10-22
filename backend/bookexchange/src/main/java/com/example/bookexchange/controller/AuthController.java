package com.example.bookexchange.controller;

import com.example.bookexchange.dto.LoginRequest;
import com.example.bookexchange.dto.RegisterRequest;
import com.example.bookexchange.dto.AuthResponse;
import com.example.bookexchange.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // --- Register Endpoint ---
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            authService.register(request);

            response.put("success", true);
            response.put("message", "User registered successfully!");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // --- Login Endpoint ---
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            AuthResponse authResponse = authService.login(request);

            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("token", authResponse.getToken());
            response.put("name", authResponse.getName());
            response.put("username", authResponse.getUsername());
            response.put("college", authResponse.getCollege());
            response.put("email", authResponse.getEmail());
            response.put("phone", authResponse.getPhone());
            response.put("interests", authResponse.getInterests());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Invalid credentials: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
