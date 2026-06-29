package com.example.ailmc.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

// Mark attendance for ALL mentees in one request
@Data
public class BulkAttendanceRequest {

    @NotEmpty(message = "Attendance list cannot be empty")
    private List<AttendanceEntry> attendanceList;

    @Data
    public static class AttendanceEntry {
        @NotNull private Long menteeId;
        @NotNull private Boolean isPresent;
    }
}