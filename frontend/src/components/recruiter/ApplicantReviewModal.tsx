import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { ApiClientError } from '../../services/apiClient';
import type { Job, JobApplication, ApplicationStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Alert } from '../ui/Alert';

export interface ApplicantReviewModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationUpdated?: (updatedApp: JobApplication) => void;
}

export const ApplicantReviewModal: React.FC<ApplicantReviewModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplicationUpdated,
}) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingAppId, setUpdatingAppId] = useState<number | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!job || !isOpen) return;

    let isMounted = true;
    jobService
      .getJobApplicationsForRecruiter(job.id)
      .then((data) => {
        if (!isMounted) return;
        setApplications(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Unable to load applications for this job.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [job, isOpen]);

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    setUpdatingAppId(applicationId);
    setError(null);
    setSuccessNotice(null);

    try {
      const updated = await jobService.updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );
      setSuccessNotice(`Candidate status updated to "${newStatus}".`);
      if (onApplicationUpdated) {
        onApplicationUpdated(updated);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to update candidate status. Please try again.');
      }
    } finally {
      setUpdatingAppId(null);
    }
  };

  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Applicants for ${job.title}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ padding: '0.75rem 1rem', background: 'var(--color-slate-100)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-slate-700)' }}>
          <strong>{job.company}</strong> • 📍 {job.location} • {applications.length} Applicant{applications.length !== 1 ? 's' : ''}
        </div>

        {successNotice && (
          <Alert type="success" message={successNotice} onClose={() => setSuccessNotice(null)} />
        )}

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {isLoading ? (
          <LoadingSpinner label="Loading applicant profiles..." />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No Applications Received"
            description="No candidates have applied for this position yet. Check back once candidates discover your listing!"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
            {applications.map((app) => {
              const formattedDate = new Date(app.appliedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isUpdating = updatingAppId === app.id;

              return (
                <div
                  key={app.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-white)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-slate-900)' }}>
                        {app.applicantEmail}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', marginTop: '0.125rem' }}>
                        Applied on {formattedDate}
                      </div>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  {/* Status Action Controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.625rem',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-500)' }}>
                      Update Stage:
                    </span>

                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        disabled={isUpdating || app.status === 'REVIEWING'}
                        onClick={() => handleStatusChange(app.id, 'REVIEWING')}
                        style={{
                          padding: '0.25rem 0.625rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-warning-border)',
                          backgroundColor: app.status === 'REVIEWING' ? 'var(--color-warning-bg)' : 'transparent',
                          color: 'var(--color-warning-text)',
                          cursor: isUpdating || app.status === 'REVIEWING' ? 'not-allowed' : 'pointer',
                          opacity: app.status === 'REVIEWING' ? 0.6 : 1,
                        }}
                      >
                        In Review
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating || app.status === 'SHORTLISTED'}
                        onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                        style={{
                          padding: '0.25rem 0.625rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-success-border)',
                          backgroundColor: app.status === 'SHORTLISTED' ? 'var(--color-success-bg)' : 'transparent',
                          color: 'var(--color-success-text)',
                          cursor: isUpdating || app.status === 'SHORTLISTED' ? 'not-allowed' : 'pointer',
                          opacity: app.status === 'SHORTLISTED' ? 0.6 : 1,
                        }}
                      >
                        Shortlist ✓
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating || app.status === 'REJECTED'}
                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                        style={{
                          padding: '0.25rem 0.625rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-danger-border)',
                          backgroundColor: app.status === 'REJECTED' ? 'var(--color-danger-bg)' : 'transparent',
                          color: 'var(--color-danger-text)',
                          cursor: isUpdating || app.status === 'REJECTED' ? 'not-allowed' : 'pointer',
                          opacity: app.status === 'REJECTED' ? 0.6 : 1,
                        }}
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
