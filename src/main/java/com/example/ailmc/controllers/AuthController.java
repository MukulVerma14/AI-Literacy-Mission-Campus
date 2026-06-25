package com.example.ailmc.controllers;

import com.example.ailmc.dto.LoginRequest;
import com.example.ailmc.dto.RegisterRequest;
import com.example.ailmc.dto.AuthResponse;
import com.example.ailmc.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { email, password, role, name, collegeName?, techStack?, targetSkill?, currentJobFunction? }
     * Returns: JWT token + role
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: JWT token + role
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
