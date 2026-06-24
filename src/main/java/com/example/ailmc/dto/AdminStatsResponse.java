package com.example.ailmc.dto;

import lombok.Builder;
import lombok.Data;

// Response for GET /api/admin/stats
// Covers the "admin data dashboard" requirement from Upskill Academy Knowledge Tools doc
@Data
@Builder
public class AdminStatsResponse {
    // Users
    private long totalMentors;
    private long totalMentees;

    // Cohorts
    private long totalCohorts;
    private long cohortsWithSpace;

    // Learning
    private long totalProgressLogs;

    // Certifications
    private long totalCertificatesIssued;
    private long certsPendingPayment;
    private long certsPaid;
}
