package com.example.ailmc.dto;

import com.example.ailmc.models.AssessmentType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GradeAssessmentRequest {

    @NotNull(message = "Mentee ID is required")
    private Long menteeId;

    @NotNull(message = "Assessment type is required (QUIZ_1 / QUIZ_2 / FINAL_TEST / CAPSTONE)")
    private AssessmentType type;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be negative")
    @Max(value = 100, message = "Score cannot exceed 100")
    private Double score;

    private String mentorFeedback;
}
