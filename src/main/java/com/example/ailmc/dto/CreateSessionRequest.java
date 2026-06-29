package com.example.ailmc.dto;

import com.example.ailmc.models.SessionMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateSessionRequest {

    @NotNull(message = "Day number is required")
    @Min(value = 1, message = "Day number must be at least 1")
    @Max(value = 20, message = "Day number cannot exceed 20 (FOUR_WEEKS programme)")
    private Integer dayNumber;

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotNull(message = "Scheduled date/time is required")
    private LocalDateTime scheduledAt;

    @NotNull(message = "Session mode is required (ONLINE / OFFLINE / HYBRID)")
    private SessionMode mode;
}
