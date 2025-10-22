package com.example.bookexchange.security;

import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.UUID;

@Component
public class JWTProvider {

    public String generateToken(String email) {
        String raw = email + ":" + UUID.randomUUID();
        return Base64.getEncoder().encodeToString(raw.getBytes());
    }

    public String getEmailFromToken(String token) {
        String decoded = new String(Base64.getDecoder().decode(token));
        return decoded.split(":")[0];
    }
}
