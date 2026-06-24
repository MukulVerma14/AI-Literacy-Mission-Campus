package com.example.ailmc.repository;
import com.example.ailmc.models.Certification;
import com.example.ailmc.models.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {

    Optional<Certification> findByMenteeId(Long menteeId);

    boolean existsByMenteeId(Long menteeId);

    // Admin: all certs by payment status
    List<Certification> findByFeeStatus(PaymentStatus feeStatus);

    // Certs issued for a cohort (via mentee → cohort)
    List<Certification> findByMenteeCohortId(Long cohortId);

    long countByFeeStatus(PaymentStatus feeStatus);

    // Admin stats: total certs issued
    long countByCapstoneCompleted(Boolean capstoneCompleted);
}

