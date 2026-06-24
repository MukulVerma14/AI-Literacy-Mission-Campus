package com.example.ailmc.dto;

import com.example.ailmc.models.CohortSchedule;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CohortSummaryResponse {
    private Long id;
    private String cohortName;
    private String city;
    private CohortSchedule scheduleOptions;
    private String mentorName;
    private String mentorCollege;
    private int currentMembers;
    private int maxMembers;        // Always 10 per AILMC design
    private boolean hasSpace;
}
