import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, PlusCircle, ArrowRight, LogOut, User } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onOpenReportModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavScroll = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${anchorId}`);
    } else {
      const el = document.querySelector(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleReportClick = () => {
    setMobileMenuOpen(false);
    if (onOpenReportModal) {
      onOpenReportModal();
    } else {
      navigate('/items?action=report');
    }
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-logo-icon">
            <Compass size={22} className="brand-icon-svg" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">Lost<span className="brand-highlight">Link</span> <span className="brand-subtext">— Anurag University</span></span>
            <span className="brand-tagline">ANURAG UNIVERSITY CAMPUS PORTAL</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
          >
            Browse Items
          </NavLink>

          {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Admin Portal
            </NavLink>
          )}

          <button
            type="button"
            className="nav-link nav-link-btn"
            onClick={() => handleNavScroll('#how-it-works')}
          >
            How It Works
          </button>

          <button
            type="button"
            className="nav-link nav-link-btn"
            onClick={() => handleNavScroll('#about')}
          >
            About
          </button>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="navbar-actions">
          <Button
            variant="teal"
            size="sm"
            icon={PlusCircle}
            onClick={handleReportClick}
            className="nav-report-btn"
          >
            Report Item
          </Button>

          {currentUser ? (
            <div className="nav-auth-user">
              <span className="nav-user-chip" title={currentUser.email}>
                <User size={14} />
                <span className="nav-user-chip-name">{currentUser.fullName}</span>
              </span>
              <Button variant="ghost" size="sm" icon={LogOut} onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="navbar-toggle-btn"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="container mobile-drawer-content">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Items
            </NavLink>
            {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF') && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Portal
              </NavLink>
            )}
            <button
              type="button"
              className="mobile-nav-link mobile-link-btn"
              onClick={() => handleNavScroll('#how-it-works')}
            >
              How It Works
            </button>
            <button
              type="button"
              className="mobile-nav-link mobile-link-btn"
              onClick={() => handleNavScroll('#about')}
            >
              About
            </button>

            <div className="mobile-drawer-divider" />

            <div className="mobile-drawer-actions">
              <Button
                variant="teal"
                size="md"
                icon={PlusCircle}
                onClick={handleReportClick}
                className="w-full"
              >
                Report Item
              </Button>
              {currentUser ? (
                <div className="mobile-auth-logged-in">
                  <div className="mobile-user-row">
                    <User size={16} />
                    <span>{currentUser.fullName} ({currentUser.role})</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    icon={LogOut}
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="mobile-auth-grid">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="secondary" size="md" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" size="md" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
