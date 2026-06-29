package com.example.ailmc.dto;

import com.example.ailmc.models.AssessmentType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AssessmentResponse {
    private Long id;
    private Long menteeId;
    private String menteeEmail;
    private AssessmentType type;
    private Double score;
    private String grade;          // A/B/C/D/F derived from score
    private String mentorFeedback;
    private LocalDateTime gradedAt;
}
