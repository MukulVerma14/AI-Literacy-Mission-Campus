package com.example.ailmc.models;

import jakarta.persistence.*;
import lombok.*;
import org.apache.catalina.User;

import java.util.List;

@Entity
@Table(name = "ailmc_mentors")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String collegeName;
    private String techStack;

    @OneToMany(mappedBy = "mentor")
    private List<Cohort> cohorts;
}
