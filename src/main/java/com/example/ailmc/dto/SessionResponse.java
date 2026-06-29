package com.example.ailmc.dto;

import com.example.ailmc.models.SessionMode;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SessionResponse {
    private Long id;
    private Long cohortId;
    private String cohortName;
    private Integer dayNumber;
    private String topic;
    private LocalDateTime scheduledAt;
    private SessionMode mode;
    private long totalAttendees;   // how many marked present
    private long totalAbsent;
}
