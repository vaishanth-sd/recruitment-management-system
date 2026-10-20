import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { ApiClientError } from '../services/apiClient';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card, CardBody } from '../components/ui/Card';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Full name is required';
    } else if (name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email address';
    } else if (email.trim().length > 254) {
      errors.email = 'Email cannot exceed 254 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (password.length > 72) {
      errors.password = 'Password cannot exceed 72 characters';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // On successful registration, redirect to login with prefilled email state
      navigate('/login', {
        state: {
          registeredEmail: email.trim(),
          successMessage: 'Account created successfully! Please sign in with your credentials.',
        },
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.message);
      } else {
        setApiError('An unexpected error occurred during registration. Please try again.');
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
              Create Candidate Account
            </h1>
            <p style={{ color: 'var(--color-slate-500)', marginTop: '0.35rem', fontSize: '0.875rem' }}>
              Register to explore job opportunities and track your applications in real-time
            </p>
          </div>

          {apiError && <Alert type="error" message={apiError} onClose={() => setApiError(null)} />}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              required
              autoComplete="name"
            />

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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              hint="Must contain between 8 and 72 characters"
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <div style={{ marginTop: '1.75rem' }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                style={{ width: '100%' }}
                isLoading={isSubmitting}
              >
                Create Account
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
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              background: 'var(--color-slate-100)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              color: 'var(--color-slate-600)',
              lineHeight: 1.4,
            }}
          >
            <strong>Note for Recruiters:</strong> Public registration assigns the Candidate role by default.
            Recruiter credentials are pre-provisioned by your organization administrator.
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
