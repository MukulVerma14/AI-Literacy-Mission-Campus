package com.example.ailmc.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ailmc_mentees")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenteeProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String currentJobFunction;
    private String occupation;
    private String city;
    private String targetSkill;
    private String aiGoal;

    @ManyToOne
    @JoinColumn(name = "cohort_id")
    private Cohort cohort;
}
