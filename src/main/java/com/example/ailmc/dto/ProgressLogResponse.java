package com.example.ailmc.dto;

import com.example.ailmc.models.TrackType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProgressLogResponse {
    private Long id;
    private TrackType trackType;
    private Integer hoursCompleted;
    private String topicCovered;
    private String learningOutcomeNotes;
    private String productivityImpactNotes;
    private LocalDateTime loggedAt;
}
