package com.example.ailmc.controllers;

import com.example.ailmc.dto.*;
import com.example.ailmc.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * GET /api/admin/stats
     * Dashboard overview — total mentors, mentees, cohorts, certs, payment breakdown
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    /**
     * GET /api/admin/mentors
     * All mentors with cohort count and member counts
     */
    @GetMapping("/mentors")
    public ResponseEntity<List<MentorProfileResponse>> getAllMentors() {
        return ResponseEntity.ok(adminService.getAllMentors());
    }

    /**
     * GET /api/admin/cohorts
     * All cohorts across all mentors with capacity info
     */
    @GetMapping("/cohorts")
    public ResponseEntity<List<CohortSummaryResponse>> getAllCohorts() {
        return ResponseEntity.ok(adminService.getAllCohorts());
    }

    /**
     * GET /api/admin/mentees
     * All mentees with cohort assignment and hours logged
     */
    @GetMapping("/mentees")
    public ResponseEntity<List<MenteeProfileResponse>> getAllMentees() {
        return ResponseEntity.ok(adminService.getAllMentees());
    }

    /**
     * GET /api/admin/certifications
     * All issued certificates with payment status (for Sanjoy's deal closure view)
     */
    @GetMapping("/certifications")
    public ResponseEntity<List<CertificationResponse>> getAllCertifications() {
        return ResponseEntity.ok(adminService.getAllCertifications());
    }
}
