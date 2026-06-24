package com.example.ailmc.dto;

import com.example.ailmc.models.TrackType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LogProgressRequest {

    @NotNull(message = "Track type is required (MASTER_CLASS / SELF_PRACTICE / CAPSTONE)")
    private TrackType trackType;

    @Min(value = 1, message = "Hours must be at least 1")
    @Max(value = 30, message = "Hours cannot exceed 30 per log")
    @NotNull(message = "Hours completed is required")
    private Integer hoursCompleted;

    @NotBlank(message = "Topic covered is required")
    private String topicCovered;

    private String learningOutcomeNotes;

    private String productivityImpactNotes;
}
