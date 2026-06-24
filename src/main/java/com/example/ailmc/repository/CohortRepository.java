package com.example.ailmc.repository;

import com.example.ailmc.models.Cohort;
import com.example.ailmc.models.CohortSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CohortRepository extends JpaRepository<Cohort, Long> {

    // Browse open cohorts by city (mentee use case)
    List<Cohort> findByCity(String city);

    List<Cohort> findByScheduleOptions(CohortSchedule scheduleOptions);

    List<Cohort> findByCityAndScheduleOptions(String city, CohortSchedule scheduleOptions);

    // All cohorts under a specific mentor
    List<Cohort> findByMentorId(Long mentorId);

    List<Cohort> findByMentorUserEmail(String email);

    // Admin: cohorts with member count
    @Query("SELECT c, COUNT(mp) FROM Cohort c LEFT JOIN c.mentees mp GROUP BY c")
    List<Object[]> findAllWithMemberCount();

    // Cohorts that still have space (max size 10 as per AILMC design)
    @Query("SELECT c FROM Cohort c WHERE SIZE(c.mentees) < :maxSize")
    List<Cohort> findCohortsWithSpace(@Param("maxSize") int maxSize);

    @Query("SELECT c FROM Cohort c WHERE c.city = :city AND SIZE(c.mentees) < :maxSize")
    List<Cohort> findAvailableCohortsByCity(@Param("city") String city,
                                            @Param("maxSize") int maxSize);
}
