import { apiClient } from './apiClient';
import type {
  Job,
  CreateJobPayload,
  JobApplication,
  ApplicationStatus,
} from '../types';

export const jobService = {
  // Candidate & Authenticated: Fetch all available jobs
  getAllJobs: async (): Promise<Job[]> => {
    return apiClient.get<Job[]>('/api/jobs');
  },

  // Recruiter: Create a new job vacancy
  createJob: async (payload: CreateJobPayload): Promise<Job> => {
    return apiClient.post<Job>('/api/recruiter/jobs', {
      title: payload.title.trim(),
      description: payload.description.trim(),
      location: payload.location.trim(),
      company: payload.company.trim(),
    });
  },

  // Candidate: Apply for a job
  applyForJob: async (jobId: number): Promise<JobApplication> => {
    return apiClient.post<JobApplication>(`/api/jobs/${jobId}/apply`);
  },

  // Candidate: View own job application history
  getCandidateApplications: async (): Promise<JobApplication[]> => {
    return apiClient.get<JobApplication[]>('/api/candidate/applications');
  },

  // Recruiter: View applicants for a specific job posting
  getJobApplicationsForRecruiter: async (jobId: number): Promise<JobApplication[]> => {
    return apiClient.get<JobApplication[]>(`/api/recruiter/jobs/${jobId}/applications`);
  },

  // Recruiter: Update applicant pipeline status
  updateApplicationStatus: async (
    applicationId: number,
    status: ApplicationStatus
  ): Promise<JobApplication> => {
    return apiClient.patch<JobApplication>(
      `/api/recruiter/applications/${applicationId}/status`,
      { status }
    );
  },
};
