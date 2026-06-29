package com.example.ailmc.services;

import com.example.ailmc.dto.BulkAttendanceRequest;
import com.example.ailmc.dto.MarkAttendanceRequest;
import com.example.ailmc.dto.AttendanceResponse;
import com.example.ailmc.dto.AttendanceSummaryResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.models.Attendance;
import com.example.ailmc.models.MenteeProfile;
import com.example.ailmc.models.MentorProfile;
import com.example.ailmc.models.TrainingSession;
import com.example.ailmc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository      attendanceRepo;
    private final TrainingSessionRepository sessionRepo;
    private final MenteeProfileRepository   menteeRepo;
    private final MentorProfileRepository   mentorRepo;

    // ── Mark Single Attendance (Mentor) ───────────────────────────────────────

    @Transactional
    public AttendanceResponse markAttendance(String mentorEmail, Long sessionId,
                                              MarkAttendanceRequest req) {
        TrainingSession session = getSessionOwnedByMentor(mentorEmail, sessionId);

        MenteeProfile mentee = menteeRepo.findById(req.getMenteeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentee not found: " + req.getMenteeId()));

        // Verify mentee belongs to this session's cohort
        if (mentee.getCohort() == null ||
            !mentee.getCohort().getId().equals(session.getCohort().getId())) {
            throw new BadRequestException("Mentee does not belong to this cohort");
        }

        // Update if already marked, create if not
        Attendance attendance = attendanceRepo
                .findBySessionIdAndMenteeId(sessionId, req.getMenteeId())
                .orElse(Attendance.builder()
                        .session(session)
                        .mentee(mentee)
                        .build());

        attendance.setIsPresent(req.getIsPresent());
        attendance.setMarkedAt(LocalDateTime.now());
        attendanceRepo.save(attendance);

        log.info("Attendance marked: mentee {} session {} present={}",
                req.getMenteeId(), sessionId, req.getIsPresent());

        return mapToResponse(attendance);
    }

    // ── Bulk Mark Attendance (Mentor marks whole cohort at once) ──────────────

    @Transactional
    public List<AttendanceResponse> markBulkAttendance(String mentorEmail, Long sessionId,
                                                        BulkAttendanceRequest req) {
        TrainingSession session = getSessionOwnedByMentor(mentorEmail, sessionId);
        List<AttendanceResponse> results = new ArrayList<>();

        for (BulkAttendanceRequest.AttendanceEntry entry : req.getAttendanceList()) {
            MenteeProfile mentee = menteeRepo.findById(entry.getMenteeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                        "Mentee not found: " + entry.getMenteeId()));

            Attendance attendance = attendanceRepo
                    .findBySessionIdAndMenteeId(sessionId, entry.getMenteeId())
                    .orElse(Attendance.builder()
                            .session(session)
                            .mentee(mentee)
                            .build());

            attendance.setIsPresent(entry.getIsPresent());
            attendance.setMarkedAt(LocalDateTime.now());
            attendanceRepo.save(attendance);
            results.add(mapToResponse(attendance));
        }

        log.info("Bulk attendance marked for session {}: {} records",
                sessionId, results.size());
        return results;
    }

    // ── Get Attendance for a Session (Mentor view) ────────────────────────────

    public List<AttendanceResponse> getSessionAttendance(String mentorEmail,
                                                          Long sessionId) {
        getSessionOwnedByMentor(mentorEmail, sessionId); // auth check
        return attendanceRepo.findBySessionId(sessionId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Get Attendance Summary for a Mentee (Mentee view) ─────────────────────

    public AttendanceSummaryResponse getMyAttendanceSummary(String menteeEmail) {
        MenteeProfile mentee = menteeRepo.findByUserEmail(menteeEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentee not found: " + menteeEmail));

        if (mentee.getCohort() == null) {
            return AttendanceSummaryResponse.builder()
                    .menteeId(mentee.getId())
                    .menteeEmail(menteeEmail)
                    .cohortId(null)
                    .cohortName(null)
                    .totalSessions(0)
                    .sessionsAttended(0)
                    .sessionsAbsent(0)
                    .attendancePercentage(0.0)
                    .records(List.of())
                    .build();
        }

        Long cohortId  = mentee.getCohort().getId();
        Long menteeId  = mentee.getId();

        long present = attendanceRepo.countPresentByCohortAndMentee(cohortId, menteeId);
        long total   = attendanceRepo.countTotalByCohortAndMentee(cohortId, menteeId);
        long absent  = total - present;
        double pct   = total > 0 ? Math.round((present * 100.0 / total) * 10.0) / 10.0 : 0.0;

        List<AttendanceResponse> records = attendanceRepo
                .findByMenteeIdOrderByMarkedAtDesc(menteeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return AttendanceSummaryResponse.builder()
                .menteeId(menteeId)
                .menteeEmail(menteeEmail)
                .cohortId(cohortId)
                .cohortName(mentee.getCohort().getCohortName())
                .totalSessions(total)
                .sessionsAttended(present)
                .sessionsAbsent(absent)
                .attendancePercentage(pct)
                .records(records)
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private TrainingSession getSessionOwnedByMentor(String mentorEmail, Long sessionId) {
        MentorProfile mentor = mentorRepo.findByUserEmail(mentorEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentor not found: " + mentorEmail));

        TrainingSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Session not found: " + sessionId));

        if (!session.getCohort().getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("This session does not belong to your cohort");
        }
        return session;
    }

    private AttendanceResponse mapToResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .sessionId(a.getSession().getId())
                .sessionDay(a.getSession().getDayNumber())
                .sessionTopic(a.getSession().getTopic())
                .menteeId(a.getMentee().getId())
                .menteeEmail(a.getMentee().getUser().getEmail())
                .isPresent(a.getIsPresent())
                .markedAt(a.getMarkedAt())
                .build();
    }
}
