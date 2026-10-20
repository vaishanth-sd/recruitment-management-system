import React from 'react';
import { Card, CardBody } from '../components/ui/Card';

export const CandidateApplicationsPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">Track the status of all your submitted job applications</p>
        </div>
      </div>
      <Card>
        <CardBody>
          <p style={{ color: 'var(--color-slate-600)' }}>
            Application history and tracking will be integrated in Stage 5.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
