import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="nav-logo-icon" style={{ width: '1.75rem', height: '1.75rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-slate-800)' }}>
            HireFlow
          </span>
          <span className="footer-muted">
            — Enterprise Recruitment Management System
          </span>
        </div>

        <div className="footer-muted">
          <span>Integrated with Spring Boot Backend (Port 8080)</span>
        </div>
      </div>
    </footer>
  );
};
