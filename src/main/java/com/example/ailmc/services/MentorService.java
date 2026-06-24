package com.example.ailmc.services;

import com.example.ailmc.dto.CreateCohortRequest;
import com.example.ailmc.dto.CohortSummaryResponse;
import com.example.ailmc.dto.MentorProfileResponse;
import com.example.ailmc.dto.MenteeProfileResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.exceptions.UnauthorizedException;
import com.example.ailmc.models.*;
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
public class MentorService {

    private static final int MAX_COHORT_SIZE = 12; // Strategy Note: 10-12 mentees per mentor

    private final MentorProfileRepository mentorRepo;
    private final MenteeProfileRepository menteeRepo;
    private final CohortRepository        cohortRepo;
    private final ProgressLogRepository   progressRepo;

    // ── Profile ───────────────────────────────────────────────────────────────

    public MentorProfileResponse getProfile(String email) {
        MentorProfile mentor = getMentorByEmail(email);
        List<Cohort> cohorts = cohortRepo.findByMentorId(mentor.getId());

        List<CohortSummaryResponse> cohortSummaries = cohorts.stream()
                .map(c -> mapToCohortSummary(c, mentor))
                .collect(Collectors.toList());

        return MentorProfileResponse.builder()
                .id(mentor.getId())
                .userId(mentor.getUser().getId())
                .email(mentor.getUser().getEmail())
                .collegeName(mentor.getCollegeName())
                .techStack(mentor.getTechStack())
                .totalCohorts(cohorts.size())
                .cohorts(cohortSummaries)
                .build();
    }

    // ── Cohort Management ─────────────────────────────────────────────────────

    @Transactional
    public CohortSummaryResponse createCohort(String email, CreateCohortRequest req) {
        MentorProfile mentor = getMentorByEmail(email);

        Cohort cohort = Cohort.builder()
                .cohortName(req.getCohortName())
                .city(req.getCity())
                .scheduleOptions(req.getScheduleOptions())
                .mentor(mentor)
                .build();

        cohortRepo.save(cohort);
        log.info("Mentor {} created cohort: {}", email, req.getCohortName());
        return mapToCohortSummary(cohort, mentor);
    }

    public List<CohortSummaryResponse> getMyCohorts(String email) {
        MentorProfile mentor = getMentorByEmail(email);
        return cohortRepo.findByMentorId(mentor.getId()).stream()
                .map(c -> mapToCohortSummary(c, mentor))
                .collect(Collectors.toList());
    }

    // ── Mentee Management ─────────────────────────────────────────────────────

    public List<MenteeProfileResponse> getCohortMembers(String email, Long cohortId) {
        Cohort cohort = getCohortOwnedByMentor(email, cohortId);
        return menteeRepo.findByCohortId(cohort.getId()).stream()
                .map(this::mapToMenteeResponse)
                .collect(Collectors.toList());
    }

    // ── Progress & Attendance ─────────────────────────────────────────────────

    public List<MenteeProfileResponse> getMenteesWithProgress(String email, Long cohortId) {
        getCohortOwnedByMentor(email, cohortId); // auth check
        return menteeRepo.findByCohortId(cohortId).stream()
                .map(mentee -> {
                    MenteeProfileResponse res = mapToMenteeResponse(mentee);
                    Integer hours = progressRepo.sumHoursCompletedByMenteeId(mentee.getId());
                    res.setTotalHoursCompleted(hours != null ? hours : 0);
                    return res;
                })
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Cohort getCohortOwnedByMentor(String email, Long cohortId) {
        MentorProfile mentor = getMentorByEmail(email);
        Cohort cohort = cohortRepo.findById(cohortId)
                .orElseThrow(() -> new ResourceNotFoundException("Cohort not found: " + cohortId));
        if (!cohort.getMentor().getId().equals(mentor.getId())) {
            throw new UnauthorizedException("You do not own this cohort");
        }
        return cohort;
    }

    private MentorProfile getMentorByEmail(String email) {
        return mentorRepo.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for: " + email));
    }

    private CohortSummaryResponse mapToCohortSummary(Cohort c, MentorProfile mentor) {
        long members = menteeRepo.countByCohortId(c.getId());
        return CohortSummaryResponse.builder()
                .id(c.getId())
                .cohortName(c.getCohortName())
                .city(c.getCity())
                .scheduleOptions(c.getScheduleOptions())
                .mentorName(mentor.getUser().getEmail())
                .mentorCollege(mentor.getCollegeName())
                .currentMembers((int) members)
                .maxMembers(MAX_COHORT_SIZE)
                .hasSpace(members < MAX_COHORT_SIZE)
                .build();
    }

    private MenteeProfileResponse mapToMenteeResponse(MenteeProfile mp) {
        Integer hours = progressRepo.sumHoursCompletedByMenteeId(mp.getId());
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
                .totalHoursCompleted(hours != null ? hours : 0)
                .build();
    }
}
