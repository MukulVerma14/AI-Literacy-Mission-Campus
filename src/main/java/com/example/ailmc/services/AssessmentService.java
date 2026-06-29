package com.example.ailmc.services;

import com.example.ailmc.dto.GradeAssessmentRequest;
import com.example.ailmc.dto.AssessmentResponse;
import com.example.ailmc.dto.AssessmentSummaryResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.models.Assessment;
import com.example.ailmc.models.AssessmentType;
import com.example.ailmc.models.MenteeProfile;
import com.example.ailmc.models.MentorProfile;
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
public class AssessmentService {

    private final AssessmentRepository    assessmentRepo;
    private final MenteeProfileRepository menteeRepo;
    private final MentorProfileRepository mentorRepo;

    // ── Grade an Assessment (Mentor only) ─────────────────────────────────────

    @Transactional
    public AssessmentResponse gradeAssessment(String mentorEmail,
                                               GradeAssessmentRequest req) {
        // Verify mentor owns the mentee's cohort
        MentorProfile mentor = getMentorByEmail(mentorEmail);
        MenteeProfile mentee = menteeRepo.findById(req.getMenteeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentee not found: " + req.getMenteeId()));

        if (mentee.getCohort() == null ||
            !mentee.getCohort().getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("This mentee does not belong to your cohort");
        }

        // Update if already graded, create if not
        Assessment assessment = assessmentRepo
                .findByMenteeIdAndType(req.getMenteeId(), req.getType())
                .orElse(Assessment.builder()
                        .mentee(mentee)
                        .type(req.getType())
                        .build());

        assessment.setScore(req.getScore());
        assessment.setMentorFeedback(req.getMentorFeedback());
        assessment.setGradedAt(LocalDateTime.now());
        assessmentRepo.save(assessment);

        log.info("Assessment graded: mentee {} type {} score {}",
                req.getMenteeId(), req.getType(), req.getScore());

        return mapToResponse(assessment);
    }

    // ── Get Full Assessment Summary for a Mentee ──────────────────────────────

    public AssessmentSummaryResponse getMenteeAssessments(Long menteeId) {
        MenteeProfile mentee = menteeRepo.findById(menteeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentee not found: " + menteeId));

        List<Assessment> assessments = assessmentRepo
                .findByMenteeIdOrderByGradedAtDesc(menteeId);

        Double quiz1    = getScore(assessments, AssessmentType.QUIZ_1);
        Double quiz2    = getScore(assessments, AssessmentType.QUIZ_2);
        Double finalT   = getScore(assessments, AssessmentType.FINAL_TEST);
        Double capstone = getScore(assessments, AssessmentType.CAPSTONE);

        Double avg = assessmentRepo.avgScoreByMenteeId(menteeId);
        avg = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        // Eligible for cert if average >= 50 (passing mark)
        boolean eligible = avg >= 50.0;

        List<AssessmentResponse> responses = assessments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return AssessmentSummaryResponse.builder()
                .menteeId(menteeId)
                .menteeEmail(mentee.getUser().getEmail())
                .quiz1Score(quiz1)
                .quiz2Score(quiz2)
                .finalTestScore(finalT)
                .capstoneScore(capstone)
                .averageScore(avg)
                .overallGrade(calculateGrade(avg))
                .eligibleForCert(eligible)
                .assessments(responses)
                .build();
    }

    // ── Mentee views their own assessments ────────────────────────────────────

    public AssessmentSummaryResponse getMyAssessments(String menteeEmail) {
        MenteeProfile mentee = menteeRepo.findByUserEmail(menteeEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentee not found: " + menteeEmail));
        return getMenteeAssessments(mentee.getId());
    }

    // ── Admin / Mentor: all assessments by type across a cohort ──────────────

    public List<AssessmentResponse> getCohortAssessmentsByType(String mentorEmail,
                                                                Long cohortId,
                                                                AssessmentType type) {
        getMentorByEmail(mentorEmail); // auth check
        return assessmentRepo.findByCohortIdAndType(cohortId, type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private MentorProfile getMentorByEmail(String email) {
        return mentorRepo.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Mentor not found: " + email));
    }

    private Double getScore(List<Assessment> list, AssessmentType type) {
        return list.stream()
                .filter(a -> a.getType() == type)
                .map(Assessment::getScore)
                .findFirst()
                .orElse(null);
    }

    // Grade: A=90+, B=75+, C=60+, D=50+, F=below 50
    private String calculateGrade(Double avg) {
        if (avg == null || avg < 50) return "F";
        if (avg < 60)  return "D";
        if (avg < 75)  return "C";
        if (avg < 90)  return "B";
        return "A";
    }

    private AssessmentResponse mapToResponse(Assessment a) {
        return AssessmentResponse.builder()
                .id(a.getId())
                .menteeId(a.getMentee().getId())
                .menteeEmail(a.getMentee().getUser().getEmail())
                .type(a.getType())
                .score(a.getScore())
                .grade(calculateGrade(a.getScore()))
                .mentorFeedback(a.getMentorFeedback())
                .gradedAt(a.getGradedAt())
                .build();
    }
}
