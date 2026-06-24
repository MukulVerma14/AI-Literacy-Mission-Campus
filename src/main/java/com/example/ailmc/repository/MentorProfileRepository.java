package com.example.ailmc.repository;

import com.example.ailmc.models.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, Long> {

    Optional<MentorProfile> findByUserId(Long userId);

    Optional<MentorProfile> findByUserEmail(String email);

    boolean existsByUserId(Long userId);

    List<MentorProfile> findByCollegeName(String collegeName);

    // Admin: mentor with cohort count
    @Query("SELECT mp FROM MentorProfile mp LEFT JOIN FETCH mp.cohorts WHERE mp.id = :id")
    Optional<MentorProfile> findByIdWithCohorts(Long id);
}
