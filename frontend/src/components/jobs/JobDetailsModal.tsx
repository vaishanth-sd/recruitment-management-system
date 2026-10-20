import React from 'react';
import type { Job } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface JobDetailsModalProps {
  job: Job | null;
  isOpen: boolean;
  hasApplied: boolean;
  isApplying: boolean;
  onClose: () => void;
  onApply: (jobId: number) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  isOpen,
  hasApplied,
  isApplying,
  onClose,
  onApply,
}) => {
  if (!job) return null;

  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {job.company}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-slate-600)', marginTop: '0.25rem' }}>
              📍 {job.location} • Posted on {formattedDate}
            </div>
          </div>
          {hasApplied && <Badge status="APPLIED">Already Applied ✓</Badge>}
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--color-slate-600)' }}>
          <strong>Posted by:</strong> {job.recruiterEmail}
        </div>

        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.5rem' }}>
            Job Description & Requirements
          </h4>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-slate-700)',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              maxHeight: '260px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
            }}
          >
            {job.description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {hasApplied ? (
            <Button variant="secondary" disabled>
              Application Submitted
            </Button>
          ) : (
            <Button
              variant="primary"
              isLoading={isApplying}
              onClick={() => onApply(job.id)}
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
