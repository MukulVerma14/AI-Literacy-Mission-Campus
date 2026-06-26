package com.example.ailmc.config;

import com.example.ailmc.models.Role;
import com.example.ailmc.models.User;
import com.example.ailmc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByEmail("admin@ailmc.com")) {
            User admin = User.builder()
                    .email("admin@ailmc.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.SUPER_ADMIN)
                    .build();
            userRepo.save(admin);
            log.info("SUPER_ADMIN created → admin@ailmc.com / Admin@123");
        } else {
            log.info("SUPER_ADMIN already exists, skipping.");
        }
    }
}
