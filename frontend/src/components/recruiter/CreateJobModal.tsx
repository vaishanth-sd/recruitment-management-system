import React, { useState } from 'react';
import { jobService } from '../../services/jobService';
import { ApiClientError } from '../../services/apiClient';
import type { Job } from '../../types';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = 'Job title is required';
    }
    if (!company.trim()) {
      errors.company = 'Company name is required';
    }
    if (!location.trim()) {
      errors.location = 'Job location is required (e.g., Remote, San Francisco, CA)';
    }
    if (!description.trim()) {
      errors.description = 'Job description and requirements are required';
    } else if (description.trim().length > 5000) {
      errors.description = 'Description cannot exceed 5000 characters';
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
      const createdJob = await jobService.createJob({
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        description: description.trim(),
      });

      // Reset form
      setTitle('');
      setCompany('');
      setLocation('');
      setDescription('');
      setFieldErrors({});

      onJobCreated(createdJob);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setApiError(err.message);
      } else {
        setApiError('Unable to create job posting. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Job Opening">
      {apiError && <Alert type="error" message={apiError} onClose={() => setApiError(null)} />}

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            label="Company Name"
            placeholder="e.g. Acme Innovations"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            error={fieldErrors.company}
            required
          />

          <Input
            label="Location / Workplace"
            placeholder="e.g. Remote, Hybrid, or New York, NY"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={fieldErrors.location}
            required
          />
        </div>

        <Textarea
          label="Job Description & Requirements"
          rows={6}
          placeholder="Describe role responsibilities, required qualifications, tech stack, and benefits..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={fieldErrors.description}
          hint={`${description.length}/5000 characters`}
          required
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            marginTop: '1.25rem',
          }}
        >
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Publish Job Opening
          </Button>
        </div>
      </form>
    </Modal>
  );
};
