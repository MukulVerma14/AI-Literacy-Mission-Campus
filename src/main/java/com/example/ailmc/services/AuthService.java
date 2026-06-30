package com.example.ailmc.services;

import com.example.ailmc.dto.LoginRequest;
import com.example.ailmc.dto.RegisterRequest;
import com.example.ailmc.dto.AuthResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.models.*;
import com.example.ailmc.repository.*;
import com.example.ailmc.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository       userRepo;
    private final MentorProfileRepository mentorRepo;
    private final MenteeProfileRepository menteeRepo;
    private final PasswordEncoder      passwordEncoder;
    private final JwtUtil              jwtUtil;
    private final EmailService         emailService;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }

        // 1. Save user
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .build();
        userRepo.save(user);

        // 2. Save role-specific profile + send welcome email
        if (req.getRole() == Role.MENTOR) {
            MentorProfile mentor = MentorProfile.builder()
                    .user(user)
                    .city(req.getCity())
                    .collegeName(req.getCollegeName())
                    .techStack(req.getTechStack())
                    .linkedinUrl(req.getLinkedinUrl())
                    .preferredDomains(req.getPreferredDomains())
                    .build();
            mentorRepo.save(mentor);
            emailService.sendMentorWelcomeEmail(user.getEmail(), req.getName());

        } else if (req.getRole() == Role.MENTEE) {
            MenteeProfile mentee = MenteeProfile.builder()
                    .user(user)
                    .city(req.getCity())
                    .targetSkill(req.getTargetSkill())
                    .currentJobFunction(req.getCurrentJobFunction())
                    .occupation(req.getOccupation())
                    .aiGoal(req.getAiGoal())
                    .build();
            menteeRepo.save(mentee);
            emailService.sendMenteeWelcomeEmail(user.getEmail(), req.getName());
        }
        // SUPER_ADMIN: no profile needed

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        log.info("Registered new user: {} as {}", user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        log.info("Login: {}", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}