package com.example.ailmc.controllers;

import com.example.ailmc.dto.CreateCohortRequest;
import com.example.ailmc.dto.CohortSummaryResponse;
import com.example.ailmc.dto.MenteeProfileResponse;
import com.example.ailmc.dto.MentorProfileResponse;
import com.example.ailmc.services.MentorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    /**
     * GET /api/mentor/profile
     * Returns the logged-in mentor's profile + all their cohorts
     */
    @GetMapping("/profile")
    public ResponseEntity<MentorProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(mentorService.getProfile(auth.getName()));
    }

    /**
     * GET /api/mentor/cohorts
     * Returns all cohorts created by this mentor
     */
    @GetMapping("/cohorts")
    public ResponseEntity<List<CohortSummaryResponse>> getMyCohorts(Authentication auth) {
        return ResponseEntity.ok(mentorService.getMyCohorts(auth.getName()));
    }

    /**
     * POST /api/mentor/cohorts
     * Body: { cohortName, city, scheduleOptions }
     * Creates a new cohort under this mentor
     */
    @PostMapping("/cohorts")
    public ResponseEntity<CohortSummaryResponse> createCohort(
            @Valid @RequestBody CreateCohortRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mentorService.createCohort(auth.getName(), req));
    }

    /**
     * GET /api/mentor/cohorts/{cohortId}/members
     * Returns list of all mentees in a specific cohort (must be your cohort)
     */
    @GetMapping("/cohorts/{cohortId}/members")
    public ResponseEntity<List<MenteeProfileResponse>> getCohortMembers(
            @PathVariable Long cohortId,
            Authentication auth) {
        return ResponseEntity.ok(mentorService.getCohortMembers(auth.getName(), cohortId));
    }

    /**
     * GET /api/mentor/cohorts/{cohortId}/progress
     * Returns mentees with their total hours logged (for tracking dashboard)
     */
    @GetMapping("/cohorts/{cohortId}/progress")
    public ResponseEntity<List<MenteeProfileResponse>> getCohortProgress(
            @PathVariable Long cohortId,
            Authentication auth) {
        return ResponseEntity.ok(mentorService.getMenteesWithProgress(auth.getName(), cohortId));
    }
}
