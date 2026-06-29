package com.example.ailmc.services;

import com.example.ailmc.dto.CreateSessionRequest;
import com.example.ailmc.dto.SessionResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.exceptions.UnauthorizedException;
import com.example.ailmc.models.Cohort;
import com.example.ailmc.models.MentorProfile;
import com.example.ailmc.models.TrainingSession;
import com.example.ailmc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final TrainingSessionRepository sessionRepo;
    private final CohortRepository          cohortRepo;
    private final MentorProfileRepository   mentorRepo;
    private final AttendanceRepository      attendanceRepo;

    // ── Schedule a Session (Mentor only) ──────────────────────────────────────

    @Transactional
    public SessionResponse scheduleSession(String mentorEmail, Long cohortId,
                                            CreateSessionRequest req) {
        // Verify mentor owns this cohort
        MentorProfile mentor = getMentorByEmail(mentorEmail);
        Cohort cohort = getCohortOwnedByMentor(mentor, cohortId);

        // Prevent duplicate day numbers
        if (sessionRepo.existsByCohortIdAndDayNumber(cohortId, req.getDayNumber())) {
            throw new BadRequestException(
                "Day " + req.getDayNumber() + " already scheduled for this cohort");
        }

        // Max 20 sessions per FOUR_WEEKS programme
        long existingSessions = sessionRepo.countByCohortId(cohortId);
        if (existingSessions >= 20) {
            throw new BadRequestException(
                "Maximum 20 sessions allowed per cohort (programme is 20 days)");
        }

        TrainingSession session = TrainingSession.builder()
                .cohort(cohort)
                .dayNumber(req.getDayNumber())
                .topic(req.getTopic())
                .scheduledAt(req.getScheduledAt())
                .mode(req.getMode())
                .build();

        sessionRepo.save(session);
        log.info("Session scheduled: Day {} - {} for cohort {}",
                req.getDayNumber(), req.getTopic(), cohortId);

        return mapToResponse(session);
    }

    // ── Get All Sessions for a Cohort ─────────────────────────────────────────

    public List<SessionResponse> getCohortSessions(String mentorEmail, Long cohortId) {
        MentorProfile mentor = getMentorByEmail(mentorEmail);
        getCohortOwnedByMentor(mentor, cohortId); // auth check

        return sessionRepo.findByCohortIdOrderByDayNumberAsc(cohortId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Mentee views their cohort sessions ────────────────────────────────────

    public List<SessionResponse> getMySessions(String menteeEmail) {
        // find mentee's cohort from MenteeProfileRepository via email
        // sessions are fetched from that cohort
        throw new BadRequestException(
            "Inject MenteeProfileRepository to complete this method");
    }

    // ── Get Single Session ────────────────────────────────────────────────────

    public SessionResponse getSession(Long sessionId) {
        TrainingSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Session not found: " + sessionId));
        return mapToResponse(session);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private MentorProfile getMentorByEmail(String email) {
        return mentorRepo.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentor not found: " + email));
    }

    private Cohort getCohortOwnedByMentor(MentorProfile mentor, Long cohortId) {
        Cohort cohort = cohortRepo.findById(cohortId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Cohort not found: " + cohortId));
        if (!cohort.getMentor().getId().equals(mentor.getId())) {
            throw new UnauthorizedException("You do not own this cohort");
        }
        return cohort;
    }

    private SessionResponse mapToResponse(TrainingSession s) {
        long present = attendanceRepo.countBySessionIdAndIsPresent(
                s.getId(), true);
        long absent  = attendanceRepo.countBySessionIdAndIsPresent(
                s.getId(), false);
        return SessionResponse.builder()
                .id(s.getId())
                .cohortId(s.getCohort().getId())
                .cohortName(s.getCohort().getCohortName())
                .dayNumber(s.getDayNumber())
                .topic(s.getTopic())
                .scheduledAt(s.getScheduledAt())
                .mode(s.getMode())
                .totalAttendees(present)
                .totalAbsent(absent)
                .build();
    }
}
