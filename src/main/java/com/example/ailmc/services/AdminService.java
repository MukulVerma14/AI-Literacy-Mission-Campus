package com.example.ailmc.services;

import com.example.ailmc.dto.*;
import com.example.ailmc.models.*;
import com.example.ailmc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final MentorProfileRepository mentorRepo;
    private final MenteeProfileRepository menteeRepo;
    private final CohortRepository        cohortRepo;
    private final ProgressLogRepository   progressRepo;
    private final CertificationRepository certRepo;

    private static final int MAX_COHORT_SIZE = 12;

    // ── Stats Dashboard ───────────────────────────────────────────────────────

    public AdminStatsResponse getStats() {
        long cohortsWithSpace = cohortRepo.findCohortsWithSpace(MAX_COHORT_SIZE).size();
        long certsPending = certRepo.countByFeeStatus(PaymentStatus.PENDING);
        long certsPaid    = certRepo.countByFeeStatus(PaymentStatus.PAID);

        return AdminStatsResponse.builder()
                .totalMentors(mentorRepo.count())
                .totalMentees(menteeRepo.count())
                .totalCohorts(cohortRepo.count())
                .cohortsWithSpace(cohortsWithSpace)
                .totalProgressLogs(progressRepo.count())
                .totalCertificatesIssued(certRepo.count())
                .certsPendingPayment(certsPending)
                .certsPaid(certsPaid)
                .build();
    }

    // ── All Mentors ───────────────────────────────────────────────────────────

    public List<MentorProfileResponse> getAllMentors() {
        return mentorRepo.findAll().stream().map(mentor -> {
            List<Cohort> cohorts = cohortRepo.findByMentorId(mentor.getId());
            List<CohortSummaryResponse> cohortSummaries = cohorts.stream()
                    .map(c -> buildCohortSummary(c, mentor))
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
        }).collect(Collectors.toList());
    }

    // ── All Cohorts ───────────────────────────────────────────────────────────

    public List<CohortSummaryResponse> getAllCohorts() {
        return cohortRepo.findAll().stream()
                .map(c -> buildCohortSummary(c, c.getMentor()))
                .collect(Collectors.toList());
    }

    // ── All Mentees ───────────────────────────────────────────────────────────

    public List<MenteeProfileResponse> getAllMentees() {
        return menteeRepo.findAll().stream().map(mp -> {
            Integer hours = progressRepo.sumHoursCompletedByMenteeId(mp.getId());
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
                    .totalHoursCompleted(hours != null ? hours : 0)
                    .certificationIssued(certIssued)
                    .build();
        }).collect(Collectors.toList());
    }

    // ── All Certifications ────────────────────────────────────────────────────

    public List<CertificationResponse> getAllCertifications() {
        return certRepo.findAll().stream().map(cert ->
                CertificationResponse.builder()
                        .id(cert.getId())
                        .menteeId(cert.getMentee().getId())
                        .menteeName(cert.getMentee().getUser().getEmail())
                        .menteeEmail(cert.getMentee().getUser().getEmail())
                        .capstoneCompleted(cert.getCapstoneCompleted())
                        .mentorRating(cert.getMentorRating())
                        .processingFeeAmount(cert.getProcessingFeeAmount())
                        .feeStatus(cert.getFeeStatus())
                        .issuedAt(cert.getIssuedAt())
                        .build()
        ).collect(Collectors.toList());
    }

    // ── Helper ────────────────────────────────────────────────────────────────

    private CohortSummaryResponse buildCohortSummary(Cohort c, MentorProfile mentor) {
        long members = menteeRepo.countByCohortId(c.getId());
        return CohortSummaryResponse.builder()
                .id(c.getId())
                .cohortName(c.getCohortName())
                .city(c.getCity())
                .scheduleOptions(c.getScheduleOptions())
                .mentorName(mentor != null ? mentor.getUser().getEmail() : "N/A")
                .mentorCollege(mentor != null ? mentor.getCollegeName() : "N/A")
                .currentMembers((int) members)
                .maxMembers(MAX_COHORT_SIZE)
                .hasSpace(members < MAX_COHORT_SIZE)
                .build();
    }
}
