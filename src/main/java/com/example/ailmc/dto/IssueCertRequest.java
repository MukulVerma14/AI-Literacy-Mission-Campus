package com.example.ailmc.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueCertRequest {

    @NotNull(message = "Mentor rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer mentorRating;

    @NotNull(message = "Processing fee amount is required")
    private Double processingFeeAmount;   // Usually Rs 50–75

    @NotNull(message = "Capstone completion status is required")
    private Boolean capstoneCompleted;
}
