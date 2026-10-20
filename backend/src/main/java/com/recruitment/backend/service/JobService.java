
package com.recruitment.backend.service;

import com.recruitment.backend.entity.Job;
import com.recruitment.backend.repository.JobRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job, String recruiterEmail) {
        job.setRecruiterEmail(recruiterEmail);
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
}
