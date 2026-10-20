import React, { useState, useEffect, useMemo } from 'react';
import { jobService } from '../services/jobService';
import { ApiClientError } from '../services/apiClient';
import type { Job } from '../types';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';

export const CandidateDashboardPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [modalJob, setModalJob] = useState<Job | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      jobService.getAllJobs(),
      jobService.getCandidateApplications().catch(() => []),
    ])
      .then(([fetchedJobs, fetchedApplications]) => {
        if (!isMounted) return;
        setJobs(fetchedJobs);
        setAppliedJobIds(new Set(fetchedApplications.map((app) => app.job.id)));
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Unable to load job postings. Please verify your connection or try again.');
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

  // Unique locations for filter
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    jobs.forEach((j) => {
      if (j.location) locSet.add(j.location);
    });
    return Array.from(locSet);
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === 'ALL' ||
        job.location.toLowerCase() === selectedLocation.toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }, [jobs, searchTerm, selectedLocation]);

  const handleApply = async (jobId: number) => {
    setApplyingJobId(jobId);
    setError(null);
    setSuccessBanner(null);

    try {
      await jobService.applyForJob(jobId);
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
      setSuccessBanner('Application successfully submitted! You can track its progress under "My Applications".');
      if (modalJob && modalJob.id === jobId) {
        setModalJob(null);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Opportunities</h1>
          <p className="page-subtitle">
            Browse available roles, learn about requirements, and submit your applications
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            ↻ Refresh Jobs
          </Button>
        </div>
      </div>

      {successBanner && (
        <Alert type="success" message={successBanner} onClose={() => setSuccessBanner(null)} />
      )}

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
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
            placeholder="🔍 Search by job title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {locations.length > 0 && (
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="ALL">All Locations ({jobs.length})</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {(searchTerm || selectedLocation !== 'ALL') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedLocation('ALL');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Jobs Grid / Loading / Empty */}
      {isLoading ? (
        <LoadingSpinner label="Fetching available jobs from HireFlow..." />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title={jobs.length === 0 ? 'No Active Job Postings' : 'No Matching Jobs Found'}
          description={
            jobs.length === 0
              ? 'There are currently no open positions listed by recruiters. Please check back later!'
              : `No job opportunities matched "${searchTerm}". Try searching with different keywords.`
          }
          actionText={jobs.length === 0 ? 'Refresh' : 'Clear Filters'}
          onAction={
            jobs.length === 0
              ? handleRefresh
              : () => {
                  setSearchTerm('');
                  setSelectedLocation('ALL');
                }
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              hasApplied={appliedJobIds.has(job.id)}
              isApplying={applyingJobId === job.id}
              onApply={handleApply}
              onViewDetails={(j) => setModalJob(j)}
            />
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        job={modalJob}
        isOpen={!!modalJob}
        hasApplied={modalJob ? appliedJobIds.has(modalJob.id) : false}
        isApplying={modalJob ? applyingJobId === modalJob.id : false}
        onClose={() => setModalJob(null)}
        onApply={handleApply}
      />
    </div>
  );
};
