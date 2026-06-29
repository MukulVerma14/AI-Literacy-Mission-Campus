package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceResponse {
    private Long id;
    private Long sessionId;
    private Integer sessionDay;
    private String sessionTopic;
    private Long menteeId;
    private String menteeEmail;
    private Boolean isPresent;
    private LocalDateTime markedAt;
}
