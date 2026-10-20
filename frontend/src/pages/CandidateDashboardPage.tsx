import React from 'react';
import { Card, CardBody } from '../components/ui/Card';

export const CandidateDashboardPage: React.FC = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Opportunities</h1>
          <p className="page-subtitle">Discover active job vacancies and submit applications</p>
        </div>
      </div>
      <Card>
        <CardBody>
          <p style={{ color: 'var(--color-slate-600)' }}>
            Candidate dashboard and real-time job listings will be integrated in Stage 5.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};
