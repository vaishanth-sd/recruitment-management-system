import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { ApiClientError } from '../services/apiClient';
import type { UserRole } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardBody } from '../components/ui/Card';

interface LocationState {
  registeredEmail?: string;
  successMessage?: string;
  from?: {
    pathname: string;
  };
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const { isAuthenticated, user, login } = useAuth();

  const [email, setEmail] = useState(state?.registeredEmail || '');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(state?.successMessage || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = state?.from?.pathname || (user.role === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard');
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate, state]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.login({
        email: email.trim(),
        password,
      });

      // Normalize role string ('ROLE_CANDIDATE' or 'CANDIDATE' -> 'CANDIDATE')
      let normalizedRole: UserRole = 'CANDIDATE';
      if (response.role.toUpperCase().includes('RECRUITER')) {
        normalizedRole = 'RECRUITER';
      }

      login(response.token, {
        id: response.id,
        name: response.name,
        email: response.email,
        role: normalizedRole,
      });

      const destination = state?.from?.pathname || (normalizedRole === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.message);
      } else {
        setApiError('Unable to sign in. Please check your credentials or backend status.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container container-narrow" style={{ paddingTop: '3rem', paddingBottom: '3.5rem' }}>
      <Card>
        <CardBody style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="nav-logo-icon" style={{ margin: '0 auto 1rem', width: '2.75rem', height: '2.75rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
              Sign In to HireFlow
            </h1>
            <p style={{ color: 'var(--color-slate-500)', marginTop: '0.35rem', fontSize: '0.875rem' }}>
              Enter your registered credentials to access your recruitment portal
            </p>
          </div>

          {successMsg && (
            <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />
          )}

          {apiError && (
            <Alert type="error" message={apiError} onClose={() => setApiError(null)} />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              required
              autoComplete="current-password"
            />

            <div style={{ marginTop: '1.75rem' }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-light)',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--color-slate-600)',
            }}
          >
            Don't have an account yet?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Candidate Account
            </Link>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--color-primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary-subtle)',
              fontSize: '0.75rem',
              color: 'var(--color-slate-700)',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              💡 Role Access Information:
            </div>
            <div>
              • <strong>Candidates:</strong> Can register via the candidate form and sign in to view jobs and submit applications.
            </div>
            <div>
              • <strong>Recruiters:</strong> Sign in with your recruiter email and password to access candidate applications and post new jobs.
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
