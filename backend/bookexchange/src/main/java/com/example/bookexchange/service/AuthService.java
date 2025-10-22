package com.example.bookexchange.service;

import com.example.bookexchange.dto.RegisterRequest;
import com.example.bookexchange.dto.LoginRequest;
import com.example.bookexchange.dto.AuthResponse;
import com.example.bookexchange.model.User;
import com.example.bookexchange.repository.UserRepository;
import com.example.bookexchange.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // --- Register ---
    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());        // ✅ Save phone
        user.setCollege(request.getCollege());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setInterests(request.getInterests()); // ✅ Save interests

        userRepository.save(user);
    }

    // --- Login ---
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        // ✅ Return all user details to frontend
        return new AuthResponse(
                token,
                user.getName(),
                user.getUsername(),
                user.getCollege(),
                user.getEmail(),
                user.getPhone(),
                user.getInterests()
        );
    }
}
