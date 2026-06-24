package com.example.ailmc.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "ailmc_cohorts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cohort {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cohortName;
    private String city;

    @Enumerated(EnumType.STRING)
    private CohortSchedule scheduleOptions; // 4, 6, or 10 weeks [cite: 199]

    @Builder.Default
    private Integer maxSize = 12;

    @Enumerated(EnumType.STRING)
    private CohortStatus status; // OPEN, CLOSED, ACTIVE, COMPLETED

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @OneToMany(mappedBy = "cohort", cascade = CascadeType.ALL)
    private List<MenteeProfile> mentees;
}
