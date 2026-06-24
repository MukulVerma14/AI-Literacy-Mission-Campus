package com.example.ailmc.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ailmc_progress_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private MenteeProfile mentee;

    @Enumerated(EnumType.STRING)
    private TrackType trackType; // Masterclass, Self-Practice, or Capstone

    private Integer hoursCompleted;
    private String topicCovered;

    // The Dual Tracker Data
    @Column(columnDefinition = "TEXT")
    private String learningOutcomeNotes;

    @Column(columnDefinition = "TEXT")
    private String productivityImpactNotes;

    private LocalDateTime loggedAt;
}
