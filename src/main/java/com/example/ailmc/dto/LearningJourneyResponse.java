package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

// Aggregated view of a mentee's full learning journey
// Maps to GET /api/mentee/tracker
@Data
@Builder
public class LearningJourneyResponse {
    private Long menteeId;
    private String menteeName;
    private String cohortName;

    // Hours per track type (out of 30 / 30 / 10)
    private Integer masterClassHours;
    private Integer selfPracticeHours;
    private Integer capstoneHours;
    private Integer totalHours;          // Max 70 hrs

    private boolean capstoneCompleted;
    private boolean certificationIssued;

    private List<ProgressLogResponse> logs;
}