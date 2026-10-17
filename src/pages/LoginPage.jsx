import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { isValidAnuragEmail, getAnuragEmailValidationError, normalizeAnuragEmail } from '../utils/emailValidator';
import './Auth.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [emailError, setEmailError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/items';

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    if (emailError) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    if (formData.email.trim()) {
      const err = getAnuragEmailValidationError(formData.email);
      setEmailError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailError(null);

    // Validate university email domain
    const emailValidationErr = getAnuragEmailValidationError(formData.email);
    if (emailValidationErr) {
      setEmailError(emailValidationErr);
      setErrorMessage(emailValidationErr);
      return;
    }

    setSubmitting(true);

    try {
      await login(normalizeAnuragEmail(formData.email), formData.password);
      // Redirect to target or items directory upon success
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-page-root">
      <div className="auth-card-container card">
        {/* Brand header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-icon">
              <Compass size={24} />
            </div>
            <span className="auth-brand-name">Lost<span className="brand-accent">Link</span></span>
          </Link>
          <span className="auth-portal-tag">ANURAG UNIVERSITY CAMPUS PORTAL</span>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in with your Anurag University account.</p>
        </div>

        {errorMessage && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Anurag University Email</label>
            <div className="auth-input-wrapper">
              <Mail size={18} className="auth-field-icon" />
              <input
                id="login-email"
                type="email"
                required
                className={`form-input auth-input ${emailError ? 'input-error' : ''}`}
                placeholder="student@anurag.edu.in"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                disabled={submitting}
              />
            </div>
            {emailError && (
              <span className="auth-field-error" style={{ color: '#dc2626', fontSize: '0.8125rem', marginTop: '4px', display: 'block' }}>
                {emailError}
              </span>
            )}
          </div>

          <div className="form-group">
            <div className="auth-label-row">
              <label className="form-label" htmlFor="login-password">Password</label>
              <a href="#forgot" className="auth-forgot-link">Forgot password?</a>
            </div>
            <div className="auth-input-wrapper">
              <Lock size={18} className="auth-field-icon" />
              <input
                id="login-password"
                type="password"
                required
                className="form-input auth-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="auth-options-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <span>Remember this device</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={submitting}
            icon={ArrowRight}
            iconPosition="right"
          >
            Sign In to Campus Portal
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have a campus account? <Link to="/register" className="auth-switch-link">Register here</Link>
          </p>
          <div className="auth-security-note">
            <ShieldCheck size={14} />
            <span>Secured via Campus Identity Access Management</span>
          </div>
        </div>
      </div>
    </div>
  );
}
