import React from 'react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  message,
  className = '',
  onClose,
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`alert alert-${type} ${className}`.trim()}
    >
      <div style={{ flex: 1 }}>{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            lineHeight: 1,
            color: 'inherit',
            opacity: 0.7,
            padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
