package com.example.ailmc.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ailmc_certifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private MenteeProfile mentee;

    private Boolean capstoneCompleted;
    private Integer mentorRating; // Rating given by mentor [cite: 27]

    private Double processingFeeAmount; // Usually Rs 50-75

    @Enumerated(EnumType.STRING)
    private PaymentStatus feeStatus;

    private LocalDateTime issuedAt;
}
