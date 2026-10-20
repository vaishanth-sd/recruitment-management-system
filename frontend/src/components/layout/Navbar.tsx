import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <div className="nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <span>HireFlow</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
            </li>

            {isAuthenticated && user?.role === 'CANDIDATE' && (
              <>
                <li>
                  <NavLink to="/candidate/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/candidate/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    My Applications
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === 'RECRUITER' && (
              <>
                <li>
                  <NavLink to="/recruiter/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Dashboard & Jobs
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions nav-desktop">
          {isAuthenticated && user ? (
            <>
              <div className="user-badge-nav">
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </span>
                <Badge role={user.role} />
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <ul className="mobile-menu-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end onClick={closeMenu}>
                Home
              </NavLink>
            </li>

            {isAuthenticated && user?.role === 'CANDIDATE' && (
              <>
                <li>
                  <NavLink to="/candidate/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    Browse Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/candidate/applications" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                    My Applications
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && user?.role === 'RECRUITER' && (
              <li>
                <NavLink to="/recruiter/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
                  Recruiter Workspace
                </NavLink>
              </li>
            )}
          </ul>

          <div className="mobile-menu-footer">
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                <div className="user-badge-nav" style={{ justifyContent: 'center' }}>
                  <span>{user.name}</span>
                  <Badge role={user.role} />
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} style={{ width: '100%' }}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <Link to="/login" onClick={closeMenu} style={{ width: '100%' }}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenu} style={{ width: '100%' }}>
                  <Button variant="primary" size="sm" style={{ width: '100%' }}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
