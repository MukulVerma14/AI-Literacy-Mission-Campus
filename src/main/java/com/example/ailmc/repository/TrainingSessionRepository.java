package com.example.ailmc.repository;

import com.example.ailmc.models.SessionMode;
import com.example.ailmc.models.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {

    List<TrainingSession> findByCohortIdOrderByDayNumberAsc(Long cohortId);

    List<TrainingSession> findByCohortIdAndMode(Long cohortId, SessionMode mode);

    long countByCohortId(Long cohortId);

    // Prevent duplicate day numbers in same cohort
    boolean existsByCohortIdAndDayNumber(Long cohortId, Integer dayNumber);
}
