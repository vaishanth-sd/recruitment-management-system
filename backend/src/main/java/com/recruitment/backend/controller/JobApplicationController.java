
package com.recruitment.backend.controller;

import com.recruitment.backend.entity.JobApplication;
import com.recruitment.backend.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(
            JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/jobs/{jobId}/apply")
    public JobApplication applyForJob(
            @PathVariable Long jobId,
            Principal principal) {
        return applicationService.applyForJob(
                jobId, principal.getName());
    }

    @GetMapping("/candidate/applications")
    public List<JobApplication> getMyApplications(
            Principal principal) {
        return applicationService.getMyApplications(
                principal.getName());
    }

    @GetMapping("/recruiter/jobs/{jobId}/applications")
    public List<JobApplication> getJobApplications(
            @PathVariable Long jobId,
            Principal principal) {

        return applicationService.getApplicationsForRecruiter(
                jobId, principal.getName());
    }

    @PatchMapping("/recruiter/applications/{applicationId}/status")
    public JobApplication updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request,
            Principal principal) {

        return applicationService.updateApplicationStatus(
                applicationId,
                request.get("status"),
                principal.getName());
    }
}
