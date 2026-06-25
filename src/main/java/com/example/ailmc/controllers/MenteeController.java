package com.example.ailmc.controllers;

import com.example.ailmc.dto.LogProgressRequest;
import com.example.ailmc.dto.CohortSummaryResponse;
import com.example.ailmc.dto.LearningJourneyResponse;
import com.example.ailmc.dto.MenteeProfileResponse;
import com.example.ailmc.dto.ProgressLogResponse;
import com.example.ailmc.services.MenteeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentee")
@RequiredArgsConstructor
public class MenteeController {

    private final MenteeService menteeService;

    /**
     * GET /api/mentee/profile
     * Returns logged-in mentee's profile + cohort info + total hours
     */
    @GetMapping("/profile")
    public ResponseEntity<MenteeProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(menteeService.getProfile(auth.getName()));
    }

    /**
     * GET /api/mentee/cohorts?city=Mumbai
     * Browse available (open) cohorts — optionally filter by city
     */
    @GetMapping("/cohorts")
    public ResponseEntity<List<CohortSummaryResponse>> getAvailableCohorts(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(menteeService.getAvailableCohorts(city));
    }

    /**
     * POST /api/mentee/cohorts/{cohortId}/join
     * Join an open cohort (can only be in one cohort at a time)
     */
    @PostMapping("/cohorts/{cohortId}/join")
    public ResponseEntity<MenteeProfileResponse> joinCohort(
            @PathVariable Long cohortId,
            Authentication auth) {
        return ResponseEntity.ok(menteeService.joinCohort(auth.getName(), cohortId));
    }

    /**
     * GET /api/mentee/tracker
     * Returns full learning journey: hours per track, logs, cert status
     */
    @GetMapping("/tracker")
    public ResponseEntity<LearningJourneyResponse> getLearningJourney(Authentication auth) {
        return ResponseEntity.ok(menteeService.getLearningJourney(auth.getName()));
    }

    /**
     * POST /api/mentee/tracker
     * Log progress entry for MASTER_CLASS / SELF_PRACTICE / CAPSTONE
     * Body: { trackType, hoursCompleted, topicCovered, learningOutcomeNotes, productivityImpactNotes }
     */
    @PostMapping("/tracker")
    public ResponseEntity<ProgressLogResponse> logProgress(
            @Valid @RequestBody LogProgressRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(menteeService.logProgress(auth.getName(), req));
    }
}
