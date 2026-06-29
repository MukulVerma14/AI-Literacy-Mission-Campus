package com.example.ailmc.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MarkAttendanceRequest {

    @NotNull(message = "Mentee ID is required")
    private Long menteeId;

    @NotNull(message = "isPresent is required (true / false)")
    private Boolean isPresent;
}
