import React from 'react';

export interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md',
}) => {
  const sizePx = size === 'sm' ? 16 : size === 'lg' ? 36 : 24;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '0.875rem',
        color: 'var(--color-slate-500)',
      }}
      role="status"
    >
      <div
        className="spinner spinner-primary"
        style={{ width: sizePx, height: sizePx, borderWidth: '3px' }}
      />
      {label && <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</p>}
    </div>
  );
};
