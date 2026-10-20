import React from 'react';
import { Card, CardBody } from '../components/ui/Card';

export const RecruiterDashboardPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recruiter Workspace</h1>
          <p className="page-subtitle">Manage job postings, review applicants, and advance candidates</p>
        </div>
      </div>
      <Card>
        <CardBody>
          <p style={{ color: 'var(--color-slate-600)' }}>
            Recruiter dashboard, job creation, and applicant review will be integrated in Stage 6.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
