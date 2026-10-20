export type UserRole = 'CANDIDATE' | 'RECRUITER';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  company: string;
  recruiterEmail: string;
  createdAt: string;
}

export type ApplicationStatus = 'APPLIED' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED';

export interface JobApplication {
  id: number;
  job: Job;
  applicantEmail: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
}
