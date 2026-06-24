package com.example.ailmc.dto;

import com.example.ailmc.models.CohortSchedule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCohortRequest {

    @NotBlank(message = "Cohort name is required")
    private String cohortName;

    @NotBlank(message = "City is required")
    private String city;

    @NotNull(message = "Schedule option is required (FOUR_WEEKS / SIX_WEEKS / TEN_WEEKS)")
    private CohortSchedule scheduleOptions;
}
