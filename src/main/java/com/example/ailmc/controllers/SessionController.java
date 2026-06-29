package com.example.ailmc.controllers;

import com.example.ailmc.dto.CreateSessionRequest;
import com.example.ailmc.dto.SessionResponse;
import com.example.ailmc.services.SessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentor/cohorts/{cohortId}/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    /**
     * POST /api/mentor/cohorts/{cohortId}/sessions
     * MENTOR — Schedule a training session for a cohort
     * Body: { dayNumber, topic, scheduledAt, mode }
     */
    @PostMapping
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<SessionResponse> scheduleSession(
            @PathVariable Long cohortId,
            @Valid @RequestBody CreateSessionRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.scheduleSession(auth.getName(), cohortId, req));
    }

    /**
     * GET /api/mentor/cohorts/{cohortId}/sessions
     * MENTOR — Get all sessions for a cohort ordered by day
     */
    @GetMapping
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<SessionResponse>> getCohortSessions(
            @PathVariable Long cohortId,
            Authentication auth) {
        return ResponseEntity.ok(
                sessionService.getCohortSessions(auth.getName(), cohortId));
    }

    /**
     * GET /api/mentor/cohorts/{cohortId}/sessions/{sessionId}
     * MENTOR — Get single session details
     */
    @GetMapping("/{sessionId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<SessionResponse> getSession(
            @PathVariable Long cohortId,
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionService.getSession(sessionId));
    }
}
