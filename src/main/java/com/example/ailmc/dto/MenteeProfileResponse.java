package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenteeProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String targetSkill;
    private String currentJobFunction;
    // Cohort info (null if not yet joined)
    private Long cohortId;
    private String cohortName;
    private String cohortCity;
    private String cohortSchedule;
    // Progress summary
    private Integer totalHoursCompleted;
    private boolean certificationIssued;

    // Track splits
    private Integer masterClassHours;
    private Integer selfPracticeHours;
    private Integer capstoneHours;
}


