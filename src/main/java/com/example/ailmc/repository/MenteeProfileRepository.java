package com.example.ailmc.repository;

import com.example.ailmc.models.MenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenteeProfileRepository extends JpaRepository<MenteeProfile, Long> {

    Optional<MenteeProfile> findByUserId(Long userId);

    Optional<MenteeProfile> findByUserEmail(String email);

    boolean existsByUserId(Long userId);

    // All mentees in a specific cohort
    List<MenteeProfile> findByCohortId(Long cohortId);

    // Mentees not yet assigned to any cohort
    List<MenteeProfile> findByCohortIsNull();

    // Mentees by city (via cohort city)
    @Query("SELECT mp FROM MenteeProfile mp WHERE mp.cohort.city = :city")
    List<MenteeProfile> findByCohortCity(@Param("city") String city);

    long countByCohortId(Long cohortId);
}

