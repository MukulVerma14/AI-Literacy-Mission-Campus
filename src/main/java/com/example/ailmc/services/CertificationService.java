package com.example.ailmc.services;

import com.example.ailmc.dto.IssueCertRequest;
import com.example.ailmc.dto.UpdatePaymentRequest;
import com.example.ailmc.dto.CertificationResponse;
import com.example.ailmc.exceptions.BadRequestException;
import com.example.ailmc.exceptions.ResourceNotFoundException;
import com.example.ailmc.models.*;
import com.example.ailmc.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CertificationService {

    private final CertificationRepository certRepo;
    private final MenteeProfileRepository menteeRepo;
    private final MentorProfileRepository mentorRepo;
    private final ProgressLogRepository   progressRepo;
    private final EmailService            emailService;

    // ── Issue Certificate (Mentor triggers) ───────────────────────────────────

    @Transactional
    public CertificationResponse issueCertificate(String mentorEmail, Long menteeId,
                                                  IssueCertRequest req) {
        // 1. Verify mentor owns the mentee's cohort
        MenteeProfile mentee = menteeRepo.findById(menteeId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentee not found: " + menteeId));

        MentorProfile mentor = mentorRepo.findByUserEmail(mentorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found: " + mentorEmail));

        if (mentee.getCohort() == null ||
                !mentee.getCohort().getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("This mentee does not belong to your cohort");
        }

        // 2. Verify capstone is logged (Programme doc requirement)
        boolean capstoneLogged = progressRepo.existsByMenteeIdAndTrackType(
                menteeId, TrackType.CAPSTONE);
        if (!capstoneLogged) {
            throw new BadRequestException(
                    "Cannot issue certificate: mentee has not logged any Capstone hours");
        }

        // 3. Block duplicate cert
        if (certRepo.existsByMenteeId(menteeId)) {
            throw new BadRequestException("Certificate already issued for this mentee");
        }

        // 4. Create cert
        Certification cert = Certification.builder()
                .mentee(mentee)
                .capstoneCompleted(req.getCapstoneCompleted())
                .mentorRating(req.getMentorRating())
                .processingFeeAmount(req.getProcessingFeeAmount())
                .feeStatus(PaymentStatus.PENDING)
                .issuedAt(LocalDateTime.now())
                .build();

        certRepo.save(cert);
        emailService.sendCertificateIssuedEmail(
                mentee.getUser().getEmail(),
                mentee.getUser().getEmail());

        log.info("Cert issued by {} for mentee {}", mentorEmail, menteeId);
        return mapToResponse(cert);
    }

    // ── Get Certificate (Mentee views) ────────────────────────────────────────

    public CertificationResponse getCertificate(String menteeEmail) {
        MenteeProfile mentee = menteeRepo.findByUserEmail(menteeEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Mentee not found"));

        Certification cert = certRepo.findByMenteeId(mentee.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No certificate found. Complete all tracks and ask your mentor to issue one."));

        return mapToResponse(cert);
    }

    // ── Update Payment Status (Admin or payment gateway callback) ─────────────

    @Transactional
    public CertificationResponse updatePaymentStatus(Long certId, UpdatePaymentRequest req) {
        Certification cert = certRepo.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found: " + certId));

        // Block redundant updates
        if (cert.getFeeStatus() == req.getFeeStatus()) {
            throw new BadRequestException("Payment status is already " + req.getFeeStatus());
        }

        cert.setFeeStatus(req.getFeeStatus());

        // Stamp the time when payment is confirmed
        if (req.getFeeStatus() == PaymentStatus.PAID) {
            cert.setPaidAt(LocalDateTime.now());
        }

        certRepo.save(cert);
        log.info("Cert {} payment status updated to {}", certId, req.getFeeStatus());
        return mapToResponse(cert);
    }

    // ── Mapper ────────────────────────────────────────────────────────────────

    private CertificationResponse mapToResponse(Certification cert) {
        return CertificationResponse.builder()
                .id(cert.getId())
                .menteeId(cert.getMentee().getId())
                .menteeName(cert.getMentee().getUser().getEmail())
                .menteeEmail(cert.getMentee().getUser().getEmail())
                .capstoneCompleted(cert.getCapstoneCompleted())
                .mentorRating(cert.getMentorRating())
                .paidAt(cert.getPaidAt())
                .processingFeeAmount(cert.getProcessingFeeAmount())
                .feeStatus(cert.getFeeStatus())
                .issuedAt(cert.getIssuedAt())
                .build();
    }
}
