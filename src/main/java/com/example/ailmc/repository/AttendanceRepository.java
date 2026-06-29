package com.example.ailmc.repository;

import com.example.ailmc.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findBySessionId(Long sessionId);

    List<Attendance> findByMenteeIdOrderByMarkedAtDesc(Long menteeId);

    Optional<Attendance> findBySessionIdAndMenteeId(Long sessionId, Long menteeId);

    boolean existsBySessionIdAndMenteeId(Long sessionId, Long menteeId);

    long countByMenteeIdAndIsPresent(Long menteeId, Boolean isPresent);

    // Sessions attended in a specific cohort
    @Query("SELECT COUNT(a) FROM Attendance a " +
           "WHERE a.mentee.id = :menteeId " +
           "AND a.session.cohort.id = :cohortId AND a.isPresent = true")
    long countPresentByCohortAndMentee(@Param("cohortId") Long cohortId,
                                        @Param("menteeId") Long menteeId);

    // Total sessions marked for mentee in cohort
    @Query("SELECT COUNT(a) FROM Attendance a " +
           "WHERE a.mentee.id = :menteeId " +
           "AND a.session.cohort.id = :cohortId")
    long countTotalByCohortAndMentee(@Param("cohortId") Long cohortId,
                                      @Param("menteeId") Long menteeId);
}
