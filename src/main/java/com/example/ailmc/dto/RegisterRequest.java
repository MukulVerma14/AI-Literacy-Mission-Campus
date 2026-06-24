package com.example.ailmc.dto;

import com.example.ailmc.models.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required (MENTOR / MENTEE)")
    private Role role;

    // Common profile field
    @NotBlank(message = "Name is required")
    private String name;

    // ── MENTOR-only fields ─────────────────────────
    private String collegeName;
    private String techStack;

    // ── MENTEE-only fields ─────────────────────────
    private String targetSkill;
    private String currentJobFunction;
}
