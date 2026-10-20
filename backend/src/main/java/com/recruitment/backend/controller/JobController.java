
package com.recruitment.backend.controller;

import com.recruitment.backend.entity.Job;
import com.recruitment.backend.service.JobService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/recruiter/jobs")
    public Job createJob(@RequestBody Job job, Principal principal) {
        return jobService.createJob(job, principal.getName());
    }

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }
}
