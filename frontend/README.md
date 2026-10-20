# HireFlow — Frontend Client

A clean, modern, and responsive Frontend for **HireFlow** — an enterprise Recruitment Management System built with **React 19**, **TypeScript**, **Vite**, **React Router v7**, and a bespoke vanilla CSS design system.

---

## Architecture Overview

```text
frontend/
├── src/
│   ├── components/
│   │   ├── layout/            # Navbar (with mobile drawer), Footer, Layout, ProtectedRoute
│   │   ├── jobs/              # JobCard, JobDetailsModal, ApplicationCard
│   │   ├── recruiter/         # CreateJobModal, ApplicantReviewModal
│   │   └── ui/                # Button, Badge, Card, Alert, Input, Textarea, Modal, LoadingSpinner, EmptyState
│   ├── pages/
│   │   ├── LandingPage.tsx           # Public homepage with hero & feature highlights
│   │   ├── LoginPage.tsx             # Role-aware login with redirection
│   │   ├── RegisterPage.tsx          # Candidate account registration
│   │   ├── CandidateDashboardPage.tsx # Job search, filter, and 1-click apply
│   │   ├── CandidateApplicationsPage.tsx # Application history, timeline & metrics
│   │   ├── RecruiterDashboardPage.tsx # Requisitions management & candidate pipeline
│   │   └── NotFoundPage.tsx          # 404 handler
│   ├── services/
│   │   ├── apiClient.ts       # Centralized fetch client, JWT handling, error parser
│   │   ├── authService.ts     # User login & registration endpoints
│   │   └── jobService.ts      # Job listing, creation, application & status endpoints
│   ├── context/
│   │   ├── authContextDef.ts  # Isolated context definition
│   │   └── AuthContext.tsx    # AuthProvider with persistent token state
│   ├── hooks/
│   │   └── useAuth.ts         # Fast-refresh compliant auth hook
│   ├── types/
│   │   └── index.ts           # Strict TypeScript interfaces and domain types
│   ├── App.tsx                # Route configuration & provider setup
│   ├── main.tsx               # Entrypoint
│   └── index.css              # Custom SaaS design tokens and component styling
├── public/                    # Static assets & icons
├── index.html                 # HTML shell with Google Fonts
├── package.json
├── tsconfig.json
└── vite.config.ts             # Dev proxy configuration to Spring Boot
```

---

## Features

### Public Portal
- **Landing Page**: Modern hero section, key recruitment platform highlights, and dynamic role-aware navigation.
- **Candidate Registration**: Form validation matching backend constraints (Name max 100, Email max 254, Password 8-72 chars), instant conflict error reporting (HTTP 409).
- **Authentication**: JWT authentication with automatic token storage in `localStorage` and role-based redirection.

### Candidate Experience
- **Job Discovery**: Live list of active job postings from the backend API.
- **Search & Filter**: Search by title, company, location, or keywords; filter by location.
- **1-Click Apply & Modals**: View full job descriptions and submit applications with instant UI feedback.
- **Application History**: Track application statuses (`APPLIED`, `REVIEWING`, `SHORTLISTED`, `REJECTED`) with summary metric cards and status filter tabs.

### Recruiter Command Center
- **Job Requisitions**: Post new vacancies with title, company, location, and detailed specifications (up to 5000 characters).
- **Ownership Scoping**: Filter between recruiter's own postings and platform-wide listings.
- **Applicant Pipeline**: Inspect candidates who applied for each job opening with applied date and current stage.
- **Status Advancement**: One-click status updates to `REVIEWING`, `SHORTLISTED`, or `REJECTED` via `PATCH /api/recruiter/applications/{id}/status`.

---

## Backend API Integration

The frontend connects to the Spring Boot backend (`http://localhost:8080`):

| Method | Endpoint | Description | Role / Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Candidate registration | Public |
| `POST` | `/api/users/login` | User login & JWT issuance | Public |
| `GET` | `/api/jobs` | Retrieve all job postings | Authenticated |
| `POST` | `/api/recruiter/jobs` | Create a job posting | Recruiter |
| `POST` | `/api/jobs/{id}/apply` | Apply for a specific job | Candidate |
| `GET` | `/api/candidate/applications` | Candidate's own application history | Candidate |
| `GET` | `/api/recruiter/jobs/{id}/applications` | Applicants for a recruiter's job | Recruiter |
| `PATCH`| `/api/recruiter/applications/{id}/status` | Update applicant status | Recruiter |

### Authentication & Token Handling
- The frontend stores the JWT token under `hireflow_token` in `localStorage`.
- All authenticated requests automatically include the `Authorization: Bearer <token>` header through `apiClient.ts`.
- In case of an expired token or 401 response, the user session is gracefully invalidated.

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Backend API**: Spring Boot running on `http://localhost:8080`

### Installation

```powershell
cd D:\emp\frontend
npm install
```

### Development Server

```powershell
npm run dev
```

The frontend development server will launch at:
`http://localhost:5173`

Vite dev proxy is pre-configured in `vite.config.ts` to forward all `/api/*` calls to `http://localhost:8080`.

### Production Build & Linting

```powershell
# Type-check and build production bundle
npm run build

# Run Oxlint
npm run lint

# Preview production build locally
npm run preview
```

---

## Known Backend Considerations & Notes

1. **Candidate Role on Registration**:
   The backend `UserService.registerUser()` automatically sets `role = "CANDIDATE"`. Recruiter accounts must be seeded or assigned in the database.
2. **Endpoint Protection**:
   `GET /api/jobs` is configured behind `.anyRequest().authenticated()` in `SecurityConfig.java`. The frontend requires the user to sign in before querying jobs.
3. **CORS Development Proxy**:
   The Spring Boot backend does not currently define explicit CORS filters. The frontend uses Vite's built-in development proxy (`/api` -> `http://localhost:8080`) to ensure frictionless, cross-origin-compliant requests during development.
