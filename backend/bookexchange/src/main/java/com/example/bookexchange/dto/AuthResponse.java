package com.example.bookexchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String username;
    private String college;
    private String email;
    private String phone;            // ✅ added phone
    private List<String> interests;  // ✅ optional: add if you want interests
}
