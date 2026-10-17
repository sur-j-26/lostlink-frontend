import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Calendar,
  MapPin,
  Tag,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Send,
  AlertCircle,
  Award,
} from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import claimService from '../../services/claimService';
import './Modal.css';

export default function ItemDetailModal({ item, onClose, onClaimSubmit }) {
  const { currentUser, isAuthenticated } = useAuth();

  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimNotes, setClaimNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimError, setClaimError] = useState(null);

  // Claims for item reporter / staff to review
  const [itemClaims, setItemClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [reviewingClaimId, setReviewingClaimId] = useState(null);

  if (!item) return null;

  const isLost = item.type === 'lost';
  const isOwner =
    currentUser &&
    item.reporterEmail &&
    currentUser.email.toLowerCase() === item.reporterEmail.toLowerCase();
  const isStaffOrAdmin =
    currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF');
  const canManageClaims = isOwner || isStaffOrAdmin;
  const isResolvedOrClaimed =
    item.status === 'Claimed' || item.status === 'Resolved' || item.status === 'CLAIMED';

  // Load existing claims if current user is owner or staff/admin
  useEffect(() => {
    if (canManageClaims && item.id) {
      setLoadingClaims(true);
      claimService
        .getItemClaims(item.id)
        .then((data) => setItemClaims(data))
        .catch(() => {})
        .finally(() => setLoadingClaims(false));
    }
  }, [canManageClaims, item.id]);

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!claimNotes.trim()) return;

    setIsSubmitting(true);
    setClaimError(null);
    try {
      const result = await claimService.submitClaim(item.id, claimNotes.trim());
      setClaimSubmitted(true);
      if (onClaimSubmit) {
        onClaimSubmit(result);
      }
    } catch (err) {
      setClaimError(err?.message || 'Failed to submit ownership claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewClaim = async (claimId, status) => {
    setReviewingClaimId(claimId);
    try {
      await claimService.reviewClaim(claimId, status, `Reviewed by ${currentUser?.fullName}`);
      // Refresh claims list
      const updated = await claimService.getItemClaims(item.id);
      setItemClaims(updated);
    } catch (err) {
      alert(err?.message || 'Failed to update claim status');
    } finally {
      setReviewingClaimId(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-badges">
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {isLost ? 'Lost Report' : 'Found Report'}
            </span>
            <span className="modal-category">
              <Tag size={13} />
              {item.category}
            </span>
            {item.status && (
              <span className="status-tag status-held" style={{ marginLeft: '0.25rem' }}>
                {item.status}
              </span>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{item.title}</h2>

          <div className="modal-meta-grid">
            <div className="modal-meta-card">
              <MapPin size={18} className="modal-meta-icon" />
              <div>
                <span className="modal-meta-label">Campus Location</span>
                <span className="modal-meta-val">{item.location}</span>
              </div>
            </div>
            <div className="modal-meta-card">
              <Calendar size={18} className="modal-meta-icon" />
              <div>
                <span className="modal-meta-label">Date Reported</span>
                <span className="modal-meta-val">{item.formattedDate || item.date}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4 className="modal-section-title">Item Description</h4>
            <p className="modal-description-text">{item.description}</p>
          </div>

          {/* AI Matching Explainable Box */}
          {item.aiConfidence && (
            <div className="modal-ai-box">
              <Sparkles size={20} className="modal-ai-icon" />
              <div>
                <strong>Smart AI Match Detected</strong>
                <p>{item.aiConfidence}</p>
              </div>
            </div>
          )}

          {/* Campus Protocol Box */}
          <div className="modal-verification-box">
            <ShieldCheck size={20} className="modal-verify-icon" />
            <div>
              <strong>Campus Verification Protocol</strong>
              <p>
                {item.securityVerified
                  ? 'This item has been deposited at Anurag University campus security desk (Student Center Rm 104). Valid student/faculty ID is required for physical collection.'
                  : 'This item report is currently pending security desk physical verification. Claims are logged responsibly in the university audit trail.'}
              </p>
            </div>
          </div>

          {/* Received Claims (Visible to Report Owner or Staff/Admin) */}
          {canManageClaims && itemClaims.length > 0 && (
            <div className="modal-section" style={{ marginTop: '1.25rem' }}>
              <h4 className="modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} />
                <span>Claims Submitted for this Item ({itemClaims.length})</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {itemClaims.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong>Claimant: {c.claimantName} ({c.claimantEmail})</strong>
                      <span className={`status-tag status-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ color: '#475569', marginBottom: '0.5rem' }}>
                      <strong>Proof / Note:</strong> {c.verificationNotes}
                    </div>
                    {c.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={reviewingClaimId === c.id}
                          onClick={() => handleReviewClaim(c.id, 'REJECTED')}
                          style={{ color: '#dc2626' }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="teal"
                          size="sm"
                          loading={reviewingClaimId === c.id}
                          onClick={() => handleReviewClaim(c.id, 'APPROVED')}
                        >
                          Approve Ownership
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claim Action Section for non-owners */}
          <div className="modal-claim-container">
            {isResolvedOrClaimed ? (
              <div className="claim-success-card" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                <CheckCircle2 size={24} style={{ color: '#059669' }} />
                <div>
                  <h4>Item Claimed / Resolved</h4>
                  <p>This item has already been claimed and ownership was verified by Anurag University Security.</p>
                </div>
              </div>
            ) : claimSubmitted ? (
              <div className="claim-success-card">
                <CheckCircle2 size={24} className="claim-success-icon" />
                <div>
                  <h4>Ownership Claim Submitted</h4>
                  <p>
                    Anurag University Security Hub and the reporter have been notified. Please bring your university ID card to verify physical ownership.
                  </p>
                </div>
              </div>
            ) : showClaimForm ? (
              <form onSubmit={handleClaim} className="claim-form">
                {claimError && (
                  <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.6rem 0.85rem', borderRadius: '0.375rem', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={15} />
                    <span>{claimError}</span>
                  </div>
                )}
                <label className="claim-label">
                  Verification Note / Identifying Marks
                  <span className="claim-hint">
                    Describe distinctive details (e.g., serial number, wallpaper, stickers, scratches, or receipts)
                  </span>
                </label>
                <textarea
                  className="claim-textarea"
                  rows={3}
                  required
                  placeholder="Provide proof of ownership or describe unique identifiers..."
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                />
                <div className="claim-buttons">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setShowClaimForm(false);
                      setClaimError(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    loading={isSubmitting}
                    icon={Send}
                  >
                    Submit Claim
                  </Button>
                </div>
              </form>
            ) : isOwner ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                You are the reporter of this item. Any ownership claims submitted by fellow campus members will appear above.
              </div>
            ) : !isAuthenticated ? (
              <div className="claim-trigger-bar" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                <p className="claim-prompt">
                  {isLost ? 'Did you find this belonging?' : 'Is this your item?'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <Link to="/login">
                    <Button variant="primary" size="md">
                      Sign In with @anurag.edu.in to Claim
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="claim-trigger-bar">
                <p className="claim-prompt">
                  {isLost ? 'Did you find this item?' : 'Is this your item?'}
                </p>
                <Button variant="primary" size="md" onClick={() => setShowClaimForm(true)}>
                  {isLost ? 'I Found This Item' : 'Claim Ownership'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
