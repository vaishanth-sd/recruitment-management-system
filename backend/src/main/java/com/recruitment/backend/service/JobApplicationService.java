
package com.recruitment.backend.service;

import com.recruitment.backend.entity.Job;
import com.recruitment.backend.entity.JobApplication;
import com.recruitment.backend.repository.JobApplicationRepository;
import com.recruitment.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public JobApplicationService(
            JobApplicationRepository applicationRepository,
            JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    public JobApplication applyForJob(Long jobId, String applicantEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (applicationRepository.existsByJob_IdAndApplicantEmail(
                jobId, applicantEmail)) {
            throw new IllegalArgumentException(
                    "You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicantEmail(applicantEmail);

        return applicationRepository.save(application);
    }

    public List<JobApplication> getMyApplications(String applicantEmail) {
        return applicationRepository.findByApplicantEmail(applicantEmail);
    }

    public List<JobApplication> getApplicationsForRecruiter(
            Long jobId, String recruiterEmail) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));

        if (!job.getRecruiterEmail().equals(recruiterEmail)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "You cannot view applications for this job");
        }

        return applicationRepository
                .findByJob_IdAndJob_RecruiterEmail(
                        jobId, recruiterEmail);
    }

    public JobApplication updateApplicationStatus(
            Long applicationId,
            String status,
            String recruiterEmail) {

        JobApplication application = applicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Application not found"));

        if (!application.getJob().getRecruiterEmail()
                .equals(recruiterEmail)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN,
                    "You cannot update this application");
        }

        if (!List.of("APPLIED", "REVIEWING", "SHORTLISTED", "REJECTED")
                .contains(status)) {
            throw new IllegalArgumentException("Invalid application status");
        }

        application.setStatus(status);
        return applicationRepository.save(application);
    }
}
