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

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;   // ← common to both roles now

    // ── MENTOR-only fields ─────────────────────────
    private String collegeName;
    private String techStack;
    private String linkedinUrl;
    private String preferredDomains;

    // ── MENTEE-only fields ─────────────────────────
    private String targetSkill;
    private String currentJobFunction;
    private String occupation;     // e.g. "Marketing Manager", "Student", "Freelancer"
    private String aiGoal;         // e.g. "Want to automate my content workflow"
}