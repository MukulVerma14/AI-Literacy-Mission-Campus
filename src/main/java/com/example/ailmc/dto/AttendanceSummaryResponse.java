package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

// Full attendance summary for a mentee in their cohort
@Data
@Builder
public class AttendanceSummaryResponse {
    private Long menteeId;
    private String menteeEmail;
    private Long cohortId;
    private String cohortName;
    private long totalSessions;
    private long sessionsAttended;
    private long sessionsAbsent;
    private double attendancePercentage;
    private List<AttendanceResponse> records;
}
