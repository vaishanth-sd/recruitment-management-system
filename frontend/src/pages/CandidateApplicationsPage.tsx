import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { ApiClientError } from '../services/apiClient';
import type { JobApplication, ApplicationStatus } from '../types';
import { ApplicationCard } from '../components/jobs/ApplicationCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    jobService
      .getCandidateApplications()
      .then((data) => {
        if (!isMounted) return;
        setApplications(data);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError) {
          setError(err.message);
        } else {
          setError('Unable to load your applications. Please try again.');
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

  // Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter((a) => a.status === 'APPLIED').length;
    const reviewing = applications.filter((a) => a.status === 'REVIEWING').length;
    const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const rejected = applications.filter((a) => a.status === 'REJECTED').length;
    return { total, applied, reviewing, shortlisted, rejected };
  }, [applications]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    if (selectedFilter === 'ALL') return applications;
    return applications.filter((app) => app.status === selectedFilter);
  }, [applications, selectedFilter]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">
            Track the status of your applications across all recruitment stages
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            ↻ Refresh Status
          </Button>
          <Link to="/candidate/dashboard">
            <Button variant="primary" size="sm">
              Explore More Jobs
            </Button>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-500)', textTransform: 'uppercase' }}>
              Total Submitted
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginTop: '0.25rem' }}>
              {stats.total}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e', textTransform: 'uppercase' }}>
              In Review
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '0.25rem' }}>
              {stats.reviewing}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46', textTransform: 'uppercase' }}>
              Shortlisted
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.25rem' }}>
              {stats.shortlisted}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody style={{ padding: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#991b1b', textTransform: 'uppercase' }}>
              Not Selected
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '0.25rem' }}>
              {stats.rejected}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.75rem',
        }}
      >
        {(['ALL', 'APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'] as const).map((filter) => {
          const isActive = selectedFilter === filter;
          const label = filter === 'ALL' ? 'All Applications' : filter.charAt(0) + filter.slice(1).toLowerCase();
          const count =
            filter === 'ALL'
              ? stats.total
              : filter === 'APPLIED'
              ? stats.applied
              : filter === 'REVIEWING'
              ? stats.reviewing
              : filter === 'SHORTLISTED'
              ? stats.shortlisted
              : stats.rejected;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter as ApplicationStatus | 'ALL')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: isActive ? 'var(--color-primary)' : 'var(--border-light)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-white)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-slate-600)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <LoadingSpinner label="Retrieving your application history..." />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title={applications.length === 0 ? 'No Applications Yet' : `No ${selectedFilter.toLowerCase()} applications`}
          description={
            applications.length === 0
              ? 'You have not submitted any job applications yet. Browse open listings and apply today!'
              : `You do not have any applications in the "${selectedFilter.toLowerCase()}" stage.`
          }
          actionText={applications.length === 0 ? 'Browse Available Jobs' : undefined}
          onAction={applications.length === 0 ? () => {} : undefined}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
};
