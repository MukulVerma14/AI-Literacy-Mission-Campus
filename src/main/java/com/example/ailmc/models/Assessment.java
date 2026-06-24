package com.example.ailmc.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ailmc_assessments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private MenteeProfile mentee;

    @Enumerated(EnumType.STRING)
    private AssessmentType type;

    private Double score;

    @Column(columnDefinition = "TEXT")
    private String mentorFeedback; // "Mentor / Trainer evaluation report"

    private LocalDateTime gradedAt;
}