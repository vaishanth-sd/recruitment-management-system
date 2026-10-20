import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';

export const RegisterPage: React.FC = () => {
  return (
    <div className="container container-narrow" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <Card>
        <CardBody>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--color-slate-500)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
              Register as a Candidate to explore and apply for jobs
            </p>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--color-slate-600)' }}>
            Candidate registration form will be integrated in Stage 4.
          </p>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
