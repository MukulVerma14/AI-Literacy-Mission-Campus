package com.example.ailmc.controllers;

import com.example.ailmc.dto.GradeAssessmentRequest;
import com.example.ailmc.dto.AssessmentResponse;
import com.example.ailmc.dto.AssessmentSummaryResponse;
import com.example.ailmc.models.AssessmentType;
import com.example.ailmc.services.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    /**
     * POST /api/mentor/assessments
     * MENTOR — Grade an assessment for a mentee
     * Body: { menteeId, type, score, mentorFeedback }
     * type: QUIZ_1 / QUIZ_2 / FINAL_TEST / CAPSTONE
     */
    @PostMapping("/api/mentor/assessments")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<AssessmentResponse> gradeAssessment(
            @Valid @RequestBody GradeAssessmentRequest req,
            Authentication auth) {
        return ResponseEntity.ok(
                assessmentService.gradeAssessment(auth.getName(), req));
    }

    /**
     * GET /api/mentor/cohorts/{cohortId}/assessments?type=QUIZ_1
     * MENTOR — View all assessments of a specific type across a cohort
     */
    @GetMapping("/api/mentor/cohorts/{cohortId}/assessments")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<AssessmentResponse>> getCohortAssessments(
            @PathVariable Long cohortId,
            @RequestParam AssessmentType type,
            Authentication auth) {
        return ResponseEntity.ok(
                assessmentService.getCohortAssessmentsByType(
                        auth.getName(), cohortId, type));
    }

    /**
     * GET /api/mentor/mentees/{menteeId}/assessments
     * MENTOR — Full assessment summary for a specific mentee
     */
    @GetMapping("/api/mentor/mentees/{menteeId}/assessments")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<AssessmentSummaryResponse> getMenteeAssessments(
            @PathVariable Long menteeId) {
        return ResponseEntity.ok(assessmentService.getMenteeAssessments(menteeId));
    }

    /**
     * GET /api/mentee/assessments
     * MENTEE — View my own assessment scores + grade + eligibility
     */
    @GetMapping("/api/mentee/assessments")
    @PreAuthorize("hasRole('MENTEE')")
    public ResponseEntity<AssessmentSummaryResponse> getMyAssessments(
            Authentication auth) {
        return ResponseEntity.ok(
                assessmentService.getMyAssessments(auth.getName()));
    }
}
