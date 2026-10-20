import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import { ApiClientError } from '../services/apiClient';
import type { Job } from '../types';
import { CreateJobModal } from '../components/recruiter/CreateJobModal';
import { ApplicantReviewModal } from '../components/recruiter/ApplicantReviewModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export const RecruiterDashboardPage: React.FC = () => {
  const { user } = useAuth();

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [filterMineOnly, setFilterMineOnly] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [reviewJob, setReviewJob] = useState<Job | null>(null);
  const [detailsJob, setDetailsJob] = useState<Job | null>(null);

  useEffect(() => {
    let isMounted = true;

    jobService
      .getAllJobs()
      .then((jobs) => {
        if (!isMounted) return;
        setAllJobs(jobs);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Unable to load job postings. Please try again.');
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
  }, [refreshKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleJobCreated = (newJob: Job) => {
    setIsCreateModalOpen(false);
    setAllJobs((prev) => [newJob, ...prev]);
    setSuccessBanner(`Job "${newJob.title}" has been successfully created and published!`);
  };

  // Recruiter's own jobs
  const myJobs = useMemo(() => {
    if (!user) return [];
    return allJobs.filter((job) => job.recruiterEmail.toLowerCase() === user.email.toLowerCase());
  }, [allJobs, user]);

  // Displayed jobs according to toggle & search
  const displayedJobs = useMemo(() => {
    const list = filterMineOnly ? myJobs : allJobs;
    if (!searchTerm.trim()) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.location.toLowerCase().includes(term)
    );
  }, [filterMineOnly, myJobs, allJobs, searchTerm]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recruiter Workspace</h1>
          <p className="page-subtitle">
            Manage job requisitions, evaluate candidate applications, and update recruitment status
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            ↻ Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
            + Post New Job
          </Button>
        </div>
      </div>

      {successBanner && (
        <Alert type="success" message={successBanner} onClose={() => setSuccessBanner(null)} />
      )}

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Overview Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              My Active Postings
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginTop: '0.25rem' }}>
              {myJobs.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
              Posted by {user?.email}
            </span>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
              Total Platform Jobs
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginTop: '0.25rem' }}>
              {allJobs.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
              Across all recruiters
            </span>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46', textTransform: 'uppercase' }}>
              Recruiter Authority
            </span>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#065f46', marginTop: '0.5rem' }}>
              Authenticated
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
              Full access to review & update stages
            </span>
          </CardBody>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          alignItems: 'center',
          backgroundColor: 'var(--color-white)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search your job listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setFilterMineOnly(true)}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: filterMineOnly ? 'var(--color-primary)' : 'var(--border-medium)',
              backgroundColor: filterMineOnly ? 'var(--color-primary-light)' : 'transparent',
              color: filterMineOnly ? 'var(--color-primary)' : 'var(--color-slate-700)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            My Postings ({myJobs.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterMineOnly(false)}
            style={{
              padding: '0.5rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: !filterMineOnly ? 'var(--color-primary)' : 'var(--border-medium)',
              backgroundColor: !filterMineOnly ? 'var(--color-primary-light)' : 'transparent',
              color: !filterMineOnly ? 'var(--color-primary)' : 'var(--color-slate-700)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: 'pointer',
            }}
          >
            All Platform Jobs ({allJobs.length})
          </button>
        </div>
      </div>

      {/* Jobs Listing */}
      {isLoading ? (
        <LoadingSpinner label="Loading recruiter listings..." />
      ) : displayedJobs.length === 0 ? (
        <EmptyState
          title={filterMineOnly ? 'You Have No Active Job Postings' : 'No Jobs Found'}
          description={
            filterMineOnly
              ? 'Get started by creating your first job requisition to attract qualified candidates.'
              : 'No job postings match your current filter.'
          }
          actionText="+ Create Job Opening"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedJobs.map((job) => {
            const isOwner = job.recruiterEmail.toLowerCase() === user?.email.toLowerCase();
            const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Card key={job.id} interactive>
                <CardBody style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                          {job.title}
                        </h3>
                        {isOwner ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                            Your Posting
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)' }}>
                            by {job.recruiterEmail}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-slate-600)', marginTop: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{job.company}</span>
                        <span>•</span>
                        <span>📍 {job.location}</span>
                        <span>•</span>
                        <span>Posted on {formattedDate}</span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--color-slate-600)',
                          marginTop: '0.5rem',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {job.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailsJob(job)}
                      >
                        Details
                      </Button>

                      {isOwner ? (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setReviewJob(job)}
                        >
                          👥 Review Applicants
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled
                          title="Only the recruiter who created this job can view and update its applicants."
                        >
                          Restricted to Owner
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {/* Applicant Review Modal */}
      <ApplicantReviewModal
        job={reviewJob}
        isOpen={!!reviewJob}
        onClose={() => setReviewJob(null)}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        job={detailsJob}
        isOpen={!!detailsJob}
        hasApplied={false}
        isApplying={false}
        onClose={() => setDetailsJob(null)}
        onApply={() => {}}
      />
    </div>
  );
};
