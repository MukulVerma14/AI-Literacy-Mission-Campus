package com.example.ailmc.dto;

import com.example.ailmc.models.PaymentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CertificationResponse {
    private Long id;
    private Long menteeId;
    private String menteeName;
    private String menteeEmail;
    private Boolean capstoneCompleted;
    private Integer mentorRating;
    private Double processingFeeAmount;
    private PaymentStatus feeStatus;
    private LocalDateTime issuedAt;
    private LocalDateTime paidAt;
}
