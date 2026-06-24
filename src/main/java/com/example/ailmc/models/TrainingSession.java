package com.example.ailmc.models;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ailmc_sessions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cohort_id", nullable = false)
    private Cohort cohort;

    private Integer dayNumber; // e.g., Day 1 to Day 20
    private String topic; // e.g., "AI Fundamentals", "Prompt Engineering"

    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    private SessionMode mode;
}
