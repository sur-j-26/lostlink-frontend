import React, { useState, useRef, useEffect } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import { CATEGORIES } from '../../constants/categories';
import { createItem } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';
import './Modal.css';

export default function ReportItemModal({ isOpen, onClose, onReportSuccess }) {
  const { currentUser } = useAuth();
  const [itemType, setItemType] = useState('lost'); // 'lost' | 'found'
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    contactInfo: currentUser?.email || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (isOpen && currentUser?.email && !formData.contactInfo) {
      setFormData((prev) => ({ ...prev, contactInfo: currentUser.email }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        type: itemType,
        category: formData.category,
        location: formData.location.trim(),
        date: formData.date,
        description: formData.description.trim(),
        contactInfo: formData.contactInfo.trim(),
      };

      const result = await createItem(payload);
      setSuccess(true);

      setTimeout(() => {
        isSubmittingRef.current = false;
        setSubmitting(false);
        if (onReportSuccess) {
          onReportSuccess(result.data);
        }
        onClose();
      }, 1000);
    } catch {
      isSubmittingRef.current = false;
      setSubmitting(false);
      setError('Failed to submit report. Please check your connection and try again.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container report-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Report an Item</h2>
            <p className="modal-subtitle">Report a lost or found item on the Anurag University campus.</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="report-success-state">
            <CheckCircle2 size={48} className="report-success-icon" />
            <h3>Report Successfully Submitted!</h3>
            <p>Your record has been logged in the Anurag University LostLink directory.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="report-form">
            {error && (
              <div className="report-error-banner">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Item Type Selector */}
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <div className="report-type-toggle">
                <button
                  type="button"
                  className={`type-toggle-btn ${itemType === 'lost' ? 'active-lost' : ''}`}
                  onClick={() => setItemType('lost')}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${itemType === 'found' ? 'active-found' : ''}`}
                  onClick={() => setItemType('found')}
                >
                  I Found Something
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="report-title">
                Item Name / Title <span className="required-star">*</span>
              </label>
              <input
                id="report-title"
                name="title"
                type="text"
                required
                className="form-input"
                placeholder="e.g., Space Gray MacBook Air, Blue Hydro Flask..."
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Category & Date Grid */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="report-category">
                  Category <span className="required-star">*</span>
                </label>
                <select
                  id="report-category"
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="report-date">
                  Date {itemType === 'lost' ? 'Lost' : 'Found'} <span className="required-star">*</span>
                </label>
                <input
                  id="report-date"
                  name="date"
                  type="date"
                  required
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label" htmlFor="report-location">
                Campus Location <span className="required-star">*</span>
              </label>
              <input
                id="report-location"
                name="location"
                type="text"
                required
                className="form-input"
                placeholder="e.g., Central Library, Block D Auditorium, CSE Labs, Main Canteen..."
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="report-description">
                Description & Distinguishing Features <span className="required-star">*</span>
              </label>
              <textarea
                id="report-description"
                name="description"
                required
                rows={3}
                className="form-textarea"
                placeholder="Mention color, brand, stickers, scratches, case color, or identifying details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Contact Info */}
            <div className="form-group">
              <label className="form-label" htmlFor="report-contact">
                Your Campus Email / Phone <span className="required-star">*</span>
              </label>
              <input
                id="report-contact"
                name="contactInfo"
                type="text"
                required
                className="form-input"
                placeholder="e.g., kavya.reddy@anurag.edu.in or +91 98765 43210"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </div>

            <div className="modal-form-actions">
              <Button variant="secondary" size="md" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={itemType === 'lost' ? 'primary' : 'teal'}
                size="md"
                type="submit"
                loading={submitting}
                icon={Send}
              >
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
