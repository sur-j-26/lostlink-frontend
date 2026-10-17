import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, IdCard, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { isValidAnuragEmail, getAnuragEmailValidationError, normalizeAnuragEmail } from '../utils/emailValidator';
import './Auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    role: 'Student',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [emailError, setEmailError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, email: val }));
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

    // Strict Anurag University Email Validation
    const emailValidationErr = getAnuragEmailValidationError(formData.email);
    if (emailValidationErr) {
      setEmailError(emailValidationErr);
      setErrorMessage(emailValidationErr);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: normalizeAnuragEmail(formData.email),
        password: formData.password,
        studentId: formData.studentId.trim(),
        role: formData.role.toUpperCase(),
      });
      // Redirect to directory upon successful registration
      navigate('/items', { replace: true });
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="auth-page-root">
      <div className="auth-card-container card register-card">
        {/* Brand header */}
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="auth-brand-icon">
              <Compass size={24} />
            </div>
            <span className="auth-brand-name">Lost<span className="brand-accent">Link</span></span>
          </Link>
          <span className="auth-portal-tag">ANURAG UNIVERSITY CAMPUS PORTAL</span>
          <h2 className="auth-title">Create Campus Account</h2>
          <p className="auth-subtitle">Register using your official Anurag University email.</p>
        </div>

        {errorMessage && (
          <div className="auth-error-banner" role="alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-field-icon" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  className="form-input auth-input"
                  placeholder="e.g. Alex Smith"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-studentid">Student / Staff ID</label>
              <div className="auth-input-wrapper">
                <IdCard size={18} className="auth-field-icon" />
                <input
                  id="reg-studentid"
                  type="text"
                  required
                  className="form-input auth-input"
                  placeholder="e.g. 21U1A0501"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-email">Anurag University Email</label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-field-icon" />
                <input
                  id="reg-email"
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

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-role">Campus Affiliation</label>
              <select
                id="reg-role"
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={submitting}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty Member</option>
                <option value="Staff">University Staff</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-pass">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-field-icon" />
                <input
                  id="reg-pass"
                  type="password"
                  required
                  minLength={6}
                  className="form-input auth-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="reg-confirmpass">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-field-icon" />
                <input
                  id="reg-confirmpass"
                  type="password"
                  required
                  className="form-input auth-input"
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="auth-options-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                disabled={submitting}
              />
              <span>I agree to follow the campus honor code and lost & found verification policies.</span>
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
            Create Campus Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-switch-link">Sign in here</Link>
          </p>
          <div className="auth-security-note">
            <ShieldCheck size={14} />
            <span>Registration restricted to verified campus community members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
