package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MentorProfileResponse {
    private Long id;
    private Long userId;
    private String email;
    private String collegeName;
    private String techStack;
    private int totalCohorts;
    private List<CohortSummaryResponse> cohorts;
}
