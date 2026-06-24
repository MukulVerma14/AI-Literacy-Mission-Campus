package com.example.ailmc.repository;

import com.example.ailmc.models.ProgressLog;
import com.example.ailmc.models.TrackType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {

    // All logs for a mentee (full learning journey)
    List<ProgressLog> findByMenteeIdOrderByLoggedAtDesc(Long menteeId);

    // Logs by track type for a mentee
    List<ProgressLog> findByMenteeIdAndTrackType(Long menteeId, TrackType trackType);

    // Total hours completed per mentee
    @Query("SELECT SUM(pl.hoursCompleted) FROM ProgressLog pl WHERE pl.mentee.id = :menteeId")
    Integer sumHoursCompletedByMenteeId(@Param("menteeId") Long menteeId);

    // Hours per track type for a mentee
    @Query("SELECT SUM(pl.hoursCompleted) FROM ProgressLog pl " +
            "WHERE pl.mentee.id = :menteeId AND pl.trackType = :trackType")
    Integer sumHoursCompletedByMenteeIdAndTrackType(@Param("menteeId") Long menteeId,
                                                    @Param("trackType") TrackType trackType);

    // Check if capstone is logged (needed before cert issuance)
    boolean existsByMenteeIdAndTrackType(Long menteeId, TrackType trackType);

    // Admin: logs across a whole cohort
    @Query("SELECT pl FROM ProgressLog pl WHERE pl.mentee.cohort.id = :cohortId " +
            "ORDER BY pl.loggedAt DESC")
    List<ProgressLog> findByCohortId(@Param("cohortId") Long cohortId);
}
