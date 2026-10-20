
package com.recruitment.backend.repository;

import com.recruitment.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobApplicationRepository
        extends JpaRepository<JobApplication, Long> {

    boolean existsByJob_IdAndApplicantEmail(
            Long jobId, String applicantEmail);

    List<JobApplication> findByApplicantEmail(String applicantEmail);

    List<JobApplication> findByJob_IdAndJob_RecruiterEmail(
        Long jobId, String recruiterEmail);
}
