
package com.recruitment.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"job_id", "applicant_email"}
    )
)
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "applicant_email", nullable = false)
    private String applicantEmail;

    private String status = "APPLIED";

    private LocalDateTime appliedAt;

    @PrePersist
    public void onCreate() {
        appliedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public String getApplicantEmail() {
        return applicantEmail;
    }

    public void setApplicantEmail(String applicantEmail) {
        this.applicantEmail = applicantEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}
