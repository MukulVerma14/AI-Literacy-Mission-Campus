package com.example.ailmc.repository;

import com.example.ailmc.models.Assessment;
import com.example.ailmc.models.AssessmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    List<Assessment> findByMenteeIdOrderByGradedAtDesc(Long menteeId);

    Optional<Assessment> findByMenteeIdAndType(Long menteeId, AssessmentType type);

    // Prevent duplicate assessment type per mentee
    boolean existsByMenteeIdAndType(Long menteeId, AssessmentType type);

    // All assessments of a type across a cohort
    @Query("SELECT a FROM Assessment a " +
           "WHERE a.mentee.cohort.id = :cohortId AND a.type = :type")
    List<Assessment> findByCohortIdAndType(@Param("cohortId") Long cohortId,
                                            @Param("type") AssessmentType type);

    @Query("SELECT AVG(a.score) FROM Assessment a WHERE a.mentee.id = :menteeId")
    Double avgScoreByMenteeId(@Param("menteeId") Long menteeId);
}
