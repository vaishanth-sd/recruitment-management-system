package com.recruitment.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAccessController {

    @GetMapping("/api/candidate/dashboard")
    public String candidateDashboard() {
        return "Welcome to Candidate Dashboard";
    }

    @GetMapping("/api/recruiter/dashboard")
    public String recruiterDashboard() {
        return "Welcome to Recruiter Dashboard";
    }
}