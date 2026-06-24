package com.example.ailmc.services;

import com.example.ailmc.dto.LogProgressRequest;
import com.example.ailmc.dto.CohortSummaryResponse;
import com.example.ailmc.dto.LearningJourneyResponse;
import com.example.ailmc.dto.MenteeProfileResponse;
import com.example.ailmc.dto.ProgressLogResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.models.*;
import com.example.ailmc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenteeService {

    private static final int MAX_COHORT_SIZE = 12;

    private final MenteeProfileRepository menteeRepo;
    private final CohortRepository        cohortRepo;
    private final ProgressLogRepository   progressRepo;
    private final CertificationRepository certRepo;
    private final MentorProfileRepository mentorRepo;

    // ── Profile ───────────────────────────────────────────────────────────────

    public MenteeProfileResponse getProfile(String email) {
        MenteeProfile mentee = getMenteeByEmail(email);
        return buildMenteeResponse(mentee);
    }

    // ── Browse & Join Cohorts ─────────────────────────────────────────────────

    public List<CohortSummaryResponse> getAvailableCohorts(String city) {
        List<Cohort> cohorts = (city != null && !city.isBlank())
                ? cohortRepo.findAvailableCohortsByCity(city, MAX_COHORT_SIZE)
                : cohortRepo.findCohortsWithSpace(MAX_COHORT_SIZE);

        return cohorts.stream()
                .map(this::mapToCohortSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public MenteeProfileResponse joinCohort(String email, Long cohortId) {
        MenteeProfile mentee = getMenteeByEmail(email);

        if (mentee.getCohort() != null) {
            throw new BadRequestException("You are already in a cohort: " + mentee.getCohort().getCohortName());
        }

        Cohort cohort = cohortRepo.findById(cohortId)
                .orElseThrow(() -> new ResourceNotFoundException("Cohort not found: " + cohortId));

        long currentSize = menteeRepo.countByCohortId(cohortId);
        if (currentSize >= MAX_COHORT_SIZE) {
            throw new BadRequestException("This cohort is full (max " + MAX_COHORT_SIZE + " mentees)");
        }

        mentee.setCohort(cohort);
        menteeRepo.save(mentee);
        log.info("Mentee {} joined cohort: {}", email, cohort.getCohortName());

        return buildMenteeResponse(mentee);
    }

    // ── Progress Logging (Dual Tracker) ───────────────────────────────────────

    @Transactional
    public ProgressLogResponse logProgress(String email, LogProgressRequest req) {
        MenteeProfile mentee = getMenteeByEmail(email);

        if (mentee.getCohort() == null) {
            throw new BadRequestException("You must join a cohort before logging progress");
        }

        // Validate hour caps per track type (per Programme Content doc)
        validateHourCap(mentee.getId(), req);

        ProgressLog log = ProgressLog.builder()
                .mentee(mentee)
                .trackType(req.getTrackType())
                .hoursCompleted(req.getHoursCompleted())
                .topicCovered(req.getTopicCovered())
                .learningOutcomeNotes(req.getLearningOutcomeNotes())
                .productivityImpactNotes(req.getProductivityImpactNotes())
                .loggedAt(LocalDateTime.now())
                .build();

        progressRepo.save(log);
        return mapToProgressLogResponse(log);
    }

    // ── Learning Journey (Full tracker view) ──────────────────────────────────

    public LearningJourneyResponse getLearningJourney(String email) {
        MenteeProfile mentee = getMenteeByEmail(email);

        Integer masterHours = orZero(progressRepo.sumHoursCompletedByMenteeIdAndTrackType(
                mentee.getId(), TrackType.MASTER_CLASS));
        Integer selfHours = orZero(progressRepo.sumHoursCompletedByMenteeIdAndTrackType(
                mentee.getId(), TrackType.SELF_PRACTICE));
        Integer capstoneHours = orZero(progressRepo.sumHoursCompletedByMenteeIdAndTrackType(
                mentee.getId(), TrackType.CAPSTONE));

        boolean capstoneCompleted = capstoneHours >= 10;
        boolean certIssued = certRepo.existsByMenteeId(mentee.getId());

        List<ProgressLogResponse> logs = progressRepo
                .findByMenteeIdOrderByLoggedAtDesc(mentee.getId()).stream()
                .map(this::mapToProgressLogResponse)
                .collect(Collectors.toList());

        return LearningJourneyResponse.builder()
                .menteeId(mentee.getId())
                .menteeName(mentee.getUser().getEmail())
                .cohortName(mentee.getCohort() != null ? mentee.getCohort().getCohortName() : "Not in a cohort")
                .masterClassHours(masterHours)
                .selfPracticeHours(selfHours)
                .capstoneHours(capstoneHours)
                .totalHours(masterHours + selfHours + capstoneHours)
                .capstoneCompleted(capstoneCompleted)
                .certificationIssued(certIssued)
                .logs(logs)
                .build();
    }

    // ── Validation ────────────────────────────────────────────────────────────

    private void validateHourCap(Long menteeId, LogProgressRequest req) {
        // Programme Content doc: MASTER_CLASS=30hrs, SELF_PRACTICE=30hrs, CAPSTONE=10hrs
        int cap = switch (req.getTrackType()) {
            case MASTER_CLASS   -> 30;
            case SELF_PRACTICE  -> 30;
            case CAPSTONE       -> 10;
        };

        Integer alreadyLogged = orZero(progressRepo.sumHoursCompletedByMenteeIdAndTrackType(
                menteeId, req.getTrackType()));

        if (alreadyLogged + req.getHoursCompleted() > cap) {
            throw new BadRequestException(
                    req.getTrackType().name() + " cap is " + cap + " hrs. "
                            + "Already logged: " + alreadyLogged + " hrs. "
                            + "You can only log " + (cap - alreadyLogged) + " more hrs."
            );
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private MenteeProfile getMenteeByEmail(String email) {
        return menteeRepo.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Mentee profile not found for: " + email));
    }

    private Integer orZero(Integer val) {
        return val != null ? val : 0;
    }

    private MenteeProfileResponse buildMenteeResponse(MenteeProfile mp) {
        Integer hours = orZero(progressRepo.sumHoursCompletedByMenteeId(mp.getId()));
        boolean certIssued = certRepo.existsByMenteeId(mp.getId());
        return MenteeProfileResponse.builder()
                .id(mp.getId())
                .userId(mp.getUser().getId())
                .email(mp.getUser().getEmail())
                .targetSkill(mp.getTargetSkill())
                .currentJobFunction(mp.getCurrentJobFunction())
                .cohortId(mp.getCohort() != null ? mp.getCohort().getId() : null)
                .cohortName(mp.getCohort() != null ? mp.getCohort().getCohortName() : null)
                .cohortCity(mp.getCohort() != null ? mp.getCohort().getCity() : null)
                .cohortSchedule(mp.getCohort() != null ? mp.getCohort().getScheduleOptions().name() : null)
                .totalHoursCompleted(hours)
                .certificationIssued(certIssued)
                .build();
    }

    private CohortSummaryResponse mapToCohortSummary(Cohort c) {
        long members = menteeRepo.countByCohortId(c.getId());
        MentorProfile mentor = c.getMentor();
        return CohortSummaryResponse.builder()
                .id(c.getId())
                .cohortName(c.getCohortName())
                .city(c.getCity())
                .scheduleOptions(c.getScheduleOptions())
                .mentorName(mentor != null ? mentor.getUser().getEmail() : "TBD")
                .mentorCollege(mentor != null ? mentor.getCollegeName() : "TBD")
                .currentMembers((int) members)
                .maxMembers(MAX_COHORT_SIZE)
                .hasSpace(members < MAX_COHORT_SIZE)
                .build();
    }

    private ProgressLogResponse mapToProgressLogResponse(ProgressLog pl) {
        return ProgressLogResponse.builder()
                .id(pl.getId())
                .trackType(pl.getTrackType())
                .hoursCompleted(pl.getHoursCompleted())
                .topicCovered(pl.getTopicCovered())
                .learningOutcomeNotes(pl.getLearningOutcomeNotes())
                .productivityImpactNotes(pl.getProductivityImpactNotes())
                .loggedAt(pl.getLoggedAt())
                .build();
    }
}
