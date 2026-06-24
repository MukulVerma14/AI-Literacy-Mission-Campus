package com.example.ailmc.models;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ailmc_attendance")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private TrainingSession session;

    @ManyToOne
    @JoinColumn(name = "mentee_id", nullable = false)
    private MenteeProfile mentee;

    private Boolean isPresent;

    private LocalDateTime markedAt;
}
