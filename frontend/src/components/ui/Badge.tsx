import React from 'react';
import type { ApplicationStatus, UserRole } from '../../types';

export interface BadgeProps {
  status?: ApplicationStatus;
  role?: UserRole;
  variant?: 'primary' | 'secondary' | 'neutral';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  role,
  variant,
  children,
  className = '',
}) => {
  let badgeClass = 'badge';

  if (status) {
    const statusLower = status.toLowerCase();
    badgeClass += ` badge-${statusLower}`;
    return (
      <span className={`${badgeClass} ${className}`.trim()}>
        {children || status}
      </span>
    );
  }

  if (role) {
    const roleLower = role.toLowerCase();
    badgeClass += ` badge-${roleLower}`;
    return (
      <span className={`${badgeClass} ${className}`.trim()}>
        {children || role}
      </span>
    );
  }

  if (variant) {
    badgeClass += ` badge-${variant}`;
  } else {
    badgeClass += ' badge-applied';
  }

  return (
    <span className={`${badgeClass} ${className}`.trim()}>
      {children}
    </span>
  );
};
