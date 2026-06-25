package com.example.ailmc.controllers;

import com.example.ailmc.dto.IssueCertRequest;
import com.example.ailmc.dto.UpdatePaymentRequest;
import com.example.ailmc.dto.CertificationResponse;
import com.example.ailmc.services.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cert")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certService;

    /**
     * POST /api/cert/issue/{menteeId}
     * MENTOR ONLY — Issue a certificate for a mentee in your cohort
     * Body: { mentorRating, processingFeeAmount, capstoneCompleted }
     * Triggers a congratulations email to the mentee
     */
    @PostMapping("/issue/{menteeId}")
    @PreAuthorize("hasRole('MENTOR')")
    public ResponseEntity<CertificationResponse> issueCertificate(
            @PathVariable Long menteeId,
            @Valid @RequestBody IssueCertRequest req,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(certService.issueCertificate(auth.getName(), menteeId, req));
    }

    /**
     * GET /api/cert/my
     * MENTEE — View their own certificate and payment status
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('MENTEE')")
    public ResponseEntity<CertificationResponse> getMyCertificate(Authentication auth) {
        return ResponseEntity.ok(certService.getCertificate(auth.getName()));
    }

    /**
     * PATCH /api/cert/{certId}/payment
     * ADMIN — Update payment status (PENDING → PAID) after fee confirmation
     * Body: { feeStatus: "PAID" }
     */
    @PatchMapping("/{certId}/payment")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CertificationResponse> updatePayment(
            @PathVariable Long certId,
            @Valid @RequestBody UpdatePaymentRequest req) {
        return ResponseEntity.ok(certService.updatePaymentStatus(certId, req));
    }
}

