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

    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private MentorProfile mentor;

    @OneToMany(mappedBy = "cohort")
    private List<MenteeProfile> mentees;
}
