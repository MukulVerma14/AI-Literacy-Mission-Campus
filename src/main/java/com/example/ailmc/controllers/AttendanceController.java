package com.example.ailmc.controllers;

import com.example.ailmc.dto.BulkAttendanceRequest;
import com.example.ailmc.dto.MarkAttendanceRequest;
import com.example.ailmc.dto.AttendanceResponse;
import com.example.ailmc.dto.AttendanceSummaryResponse;
import com.example.ailmc.services.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    /**
     * POST /api/mentor/sessions/{sessionId}/attendance
     * MENTOR — Mark attendance for a single mentee
     * Body: { menteeId, isPresent }
     */
    @PostMapping("/api/mentor/sessions/{sessionId}/attendance")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<AttendanceResponse> markAttendance(
            @PathVariable Long sessionId,
            @Valid @RequestBody MarkAttendanceRequest req,
            Authentication auth) {
        return ResponseEntity.ok(
                attendanceService.markAttendance(auth.getName(), sessionId, req));
    }

    /**
     * POST /api/mentor/sessions/{sessionId}/attendance/bulk
     * MENTOR — Mark attendance for ALL mentees in one request
     * Body: { attendanceList: [{ menteeId, isPresent }] }
     */
    @PostMapping("/api/mentor/sessions/{sessionId}/attendance/bulk")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<AttendanceResponse>> markBulkAttendance(
            @PathVariable Long sessionId,
            @Valid @RequestBody BulkAttendanceRequest req,
            Authentication auth) {
        return ResponseEntity.ok(
                attendanceService.markBulkAttendance(auth.getName(), sessionId, req));
    }

    /**
     * GET /api/mentor/sessions/{sessionId}/attendance
     * MENTOR — View attendance for a specific session
     */
    @GetMapping("/api/mentor/sessions/{sessionId}/attendance")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<List<AttendanceResponse>> getSessionAttendance(
            @PathVariable Long sessionId,
            Authentication auth) {
        return ResponseEntity.ok(
                attendanceService.getSessionAttendance(auth.getName(), sessionId));
    }

    /**
     * GET /api/mentee/attendance
     * MENTEE — View my own attendance summary + percentage
     */
    @GetMapping("/api/mentee/attendance")
    @PreAuthorize("hasRole('MENTEE')")
    public ResponseEntity<AttendanceSummaryResponse> getMyAttendance(
            Authentication auth) {
        return ResponseEntity.ok(
                attendanceService.getMyAttendanceSummary(auth.getName()));
    }
}
