import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>✨</span> Next-Gen Recruitment Management Platform
          </div>
          <h1 className="hero-title">
            Connecting Talent with <span className="hero-title-highlight">Opportunity</span>
          </h1>
          <p className="hero-subtitle">
            HireFlow accelerates the hiring journey for both candidates and recruiters.
            Browse open positions, apply seamlessly, and track recruitment pipelines in real time.
          </p>

          <div className="hero-actions">
            {isAuthenticated ? (
              user?.role === 'RECRUITER' ? (
                <Link to="/recruiter/dashboard">
                  <Button size="lg" variant="primary">
                    Open Recruiter Dashboard →
                  </Button>
                </Link>
              ) : (
                <Link to="/candidate/dashboard">
                  <Button size="lg" variant="primary">
                    Browse Available Jobs →
                  </Button>
                </Link>
              )
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="primary">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In to Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
              Built for Modern Recruitment
            </h2>
            <p style={{ color: 'var(--color-slate-500)', marginTop: '0.5rem' }}>
              Everything candidates and recruiters need in one unified interface
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Card interactive>
              <CardBody>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Effortless Job Applications
                </h3>
                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem' }}>
                  Explore active job vacancies, inspect detailed job specifications, and apply with a single click.
                </p>
              </CardBody>
            </Card>

            <Card interactive>
              <CardBody>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Real-time Application Status
                </h3>
                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem' }}>
                  Track each application through the complete pipeline: Applied, Reviewing, Shortlisted, or Rejected.
                </p>
              </CardBody>
            </Card>

            <Card interactive>
              <CardBody>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Recruiter Candidate Pipeline
                </h3>
                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem' }}>
                  Post new job requirements, view applicants per role, and update candidate stages with instant feedback.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
