import React from 'react';
import type { JobApplication, ApplicationStatus } from '../../types';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';

export interface ApplicationCardProps {
  application: JobApplication;
}

const getStatusDescription = (status: ApplicationStatus): string => {
  switch (status) {
    case 'APPLIED':
      return 'Your application has been received and is awaiting recruiter review.';
    case 'REVIEWING':
      return 'A recruiter is currently evaluating your profile and qualifications.';
    case 'SHORTLISTED':
      return 'Congratulations! Your profile has been shortlisted for the next stage.';
    case 'REJECTED':
      return 'Thank you for your interest. The team decided to move forward with other candidates.';
    default:
      return '';
  }
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const { job, status, appliedAt } = application;

  const formattedDate = new Date(appliedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="application-card">
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.875rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
              {job.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--color-slate-600)' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{job.company}</span>
              <span>•</span>
              <span>📍 {job.location}</span>
            </div>
          </div>
          <Badge status={status} />
        </div>

        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-slate-50)',
            border: '1px solid var(--border-light)',
            marginBottom: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-slate-700)',
          }}
        >
          {getStatusDescription(status)}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-slate-400)',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '0.75rem',
          }}
        >
          <span>Applied: {formattedDate}</span>
          <span>Contact: {job.recruiterEmail}</span>
        </div>
      </CardBody>
    </Card>
  );
};
