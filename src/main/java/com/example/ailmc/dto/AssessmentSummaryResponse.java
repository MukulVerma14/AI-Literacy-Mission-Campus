package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

// Full assessment summary for a mentee
@Data
@Builder
public class AssessmentSummaryResponse {
    private Long menteeId;
    private String menteeEmail;
    private Double quiz1Score;
    private Double quiz2Score;
    private Double finalTestScore;
    private Double capstoneScore;
    private Double averageScore;
    private String overallGrade;       // based on average
    private boolean eligibleForCert;   // average >= 50
    private List<AssessmentResponse> assessments;
}
