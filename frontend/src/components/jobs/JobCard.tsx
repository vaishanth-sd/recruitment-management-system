import React from 'react';
import type { Job } from '../../types';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface JobCardProps {
  job: Job;
  hasApplied: boolean;
  isApplying?: boolean;
  onApply: (jobId: number) => void;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  hasApplied,
  isApplying = false,
  onApply,
  onViewDetails,
}) => {
  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card interactive className="job-card">
      <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
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
          {hasApplied && (
            <Badge status="APPLIED">Applied ✓</Badge>
          )}
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-slate-600)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {job.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.875rem',
            borderTop: '1px solid var(--border-light)',
            gap: '0.75rem',
            marginTop: 'auto',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)' }}>
            Posted {formattedDate}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job)}
            >
              Details
            </Button>
            {hasApplied ? (
              <Button variant="secondary" size="sm" disabled>
                Applied
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                isLoading={isApplying}
                onClick={() => onApply(job.id)}
              >
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
