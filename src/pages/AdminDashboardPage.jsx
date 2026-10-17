import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Award,
  Layers,
  Clock,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import claimService from '../services/claimService';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import './AdminDashboardPage.css';

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'claims' | 'reports' | 'users'
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Claim review state
  const [selectedClaimToReview, setSelectedClaimToReview] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewing, setReviewing] = useState(false);

  // Search/filter state for tables
  const [reportSearch, setReportSearch] = useState('');
  const [claimFilter, setClaimFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

  const isStaffOrAdmin =
    currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'STAFF');

  const loadData = async () => {
    if (!isStaffOrAdmin) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [statsData, claimsData, reportsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getClaims(),
        adminService.getReports(),
        adminService.getUsers(),
      ]);
      setStats(statsData);
      setClaims(claimsData);
      setReports(reportsData);
      setUsers(usersData);
    } catch (err) {
      setError(err?.message || 'Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isStaffOrAdmin]);

  const handleReviewClaim = async (claimId, status) => {
    setReviewing(true);
    setActionSuccess(null);
    try {
      await claimService.reviewClaim(claimId, status, reviewFeedback);
      setActionSuccess(`Claim #${claimId} has been ${status.toLowerCase()} successfully.`);
      setSelectedClaimToReview(null);
      setReviewFeedback('');
      // Reload updated claims and stats
      loadData();
    } catch (err) {
      setError(err?.message || `Failed to ${status.toLowerCase()} claim`);
    } finally {
      setReviewing(false);
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus, verified) => {
    try {
      await adminService.updateReportStatus(reportId, newStatus, verified);
      setActionSuccess(`Report #${reportId} updated to ${newStatus}`);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? { ...r, status: newStatus, securityVerified: verified ?? r.securityVerified }
            : r
        )
      );
      // Reload stats
      const updatedStats = await adminService.getStats();
      setStats(updatedStats);
    } catch (err) {
      setError(err?.message || 'Failed to update report status');
    }
  };

  if (!currentUser) {
    return (
      <div className="admin-page-root">
        <div className="container">
          <div className="admin-unauthorized-banner">
            <ShieldAlert size={48} className="admin-unauthorized-icon" />
            <h2>Authentication Required</h2>
            <p>You must be signed in with an authorized Anurag University Staff or Admin account to access this portal.</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/login">
                <Button variant="primary" size="md">
                  Sign In to Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isStaffOrAdmin) {
    return (
      <div className="admin-page-root">
        <div className="container">
          <div className="admin-unauthorized-banner">
            <ShieldAlert size={48} className="admin-unauthorized-icon" />
            <h2>Restricted Administrative Portal</h2>
            <p>
              Your account (<strong>{currentUser.email}</strong>, Role: <strong>{currentUser.role}</strong>) does not have staff or administrator privileges.
            </p>
            <p style={{ marginTop: '0.5rem', color: '#64748b', fontSize: '0.9rem' }}>
              If you believe this is in error, please contact Anurag University Campus Security or IT Support.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/items">
                <Button variant="primary" size="md">
                  Back to Campus Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredReports = reports.filter((r) => {
    if (!reportSearch.trim()) return true;
    const q = reportSearch.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
    );
  });

  const filteredClaims = claims.filter((c) => {
    if (claimFilter === 'ALL') return true;
    return c.status === claimFilter;
  });

  return (
    <div className="admin-page-root">
      {/* Header Banner */}
      <section className="admin-header-banner">
        <div className="container admin-header-container">
          <div>
            <div className="admin-badge">
              <ShieldAlert size={14} />
              <span>Campus Management & Security Desk</span>
            </div>
            <h1 className="admin-title">Anurag University Portal Administration</h1>
            <p className="admin-subtitle">
              Verify lost & found belongings, process student ownership claims, manage desk inventory, and monitor campus activity.
            </p>
          </div>
          <div>
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={loadData}>
              Refresh Data
            </Button>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* Flash Notifications */}
        {actionSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
            onClick={() => setActiveTab('claims')}
          >
            <Award size={16} />
            <span>Ownership Claims</span>
            {stats?.pendingClaims > 0 && (
              <span className="admin-tab-badge">{stats.pendingClaims} Pending</span>
            )}
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={16} />
            <span>Campus Item Reports</span>
            <span className="admin-tab-badge">{reports.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            <span>Registered Users</span>
            <span className="admin-tab-badge">{users.length}</span>
          </button>
        </div>

        {loading ? (
          <LoadingState message="Connecting to Anurag University database..." />
        ) : (
          <>
            {/* Key Metrics Grid (Always Visible) */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap icon-blue">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="admin-stat-val">{stats?.totalReports ?? 0}</div>
                  <div className="admin-stat-label">Total Reports ({stats?.lostReports ?? 0} Lost / {stats?.foundReports ?? 0} Found)</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap icon-amber">
                  <Clock size={22} />
                </div>
                <div>
                  <div className="admin-stat-val">{stats?.pendingClaims ?? 0}</div>
                  <div className="admin-stat-label">Pending Claims Awaiting Review</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap icon-emerald">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div className="admin-stat-val">{stats?.resolvedItems ?? 0}</div>
                  <div className="admin-stat-label">Belongings Successfully Resolved</div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap icon-purple">
                  <Users size={22} />
                </div>
                <div>
                  <div className="admin-stat-val">{stats?.totalUsers ?? 0}</div>
                  <div className="admin-stat-label">Registered University Accounts</div>
                </div>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Campus Security & Helpdesk Protocol</h3>
                </div>
                <div style={{ lineHeight: 1.6, color: '#334155' }}>
                  <p>
                    Welcome to the <strong>Anurag University Lost & Found Administration Console</strong>. This portal connects directly with the live campus MySQL database to ensure student and faculty belongings are managed with integrity.
                  </p>
                  <ul style={{ margin: '1rem 0 1.5rem 1.5rem' }}>
                    <li><strong>Physical Item Custody:</strong> When a found item is deposited at the security desk (Student Center Rm 104), update its status to <em>Held at Helpdesk</em> and toggle <em>Security Verified</em>.</li>
                    <li><strong>Ownership Verification:</strong> Review identifying details submitted by claimants before approving claims. Upon approval, require physical student ID verification at the desk.</li>
                    <li><strong>Claim Resolution:</strong> Approving an ownership claim automatically marks the item as claimed and rejects competing claims with transparent notifications.</li>
                  </ul>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Button variant="primary" size="md" onClick={() => setActiveTab('claims')}>
                      Review Pending Claims ({stats?.pendingClaims ?? 0})
                    </Button>
                    <Button variant="secondary" size="md" onClick={() => setActiveTab('reports')}>
                      Inspect All Reports ({reports.length})
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLAIMS REVIEW */}
            {activeTab === 'claims' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Student Ownership Claims</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Inspect proof of ownership and approve or reject claims.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={`status-tag ${claimFilter === filter ? 'status-held' : 'status-pending'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => setClaimFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredClaims.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#64748b' }}>
                    No claims found matching filter: {claimFilter}
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Claim #</th>
                          <th>Belonging / Item</th>
                          <th>Claimant</th>
                          <th>Verification Proof / Notes</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClaims.map((claim) => (
                          <React.Fragment key={claim.id}>
                            <tr>
                              <td><strong>#{claim.id}</strong></td>
                              <td>
                                <div><strong>{claim.itemTitle}</strong></div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  Item ID: #{claim.itemId} ({claim.itemType})
                                </div>
                              </td>
                              <td>
                                <div>{claim.claimantName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                  {claim.claimantEmail}
                                </div>
                              </td>
                              <td style={{ maxWidth: '280px', fontSize: '0.825rem' }}>
                                {claim.verificationNotes}
                                {claim.adminFeedback && (
                                  <div style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: '#0369a1' }}>
                                    <em>Feedback: {claim.adminFeedback}</em>
                                  </div>
                                )}
                              </td>
                              <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`status-tag status-${claim.status.toLowerCase()}`}>
                                  {claim.status}
                                </span>
                              </td>
                              <td>
                                {claim.status === 'PENDING' ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() =>
                                      setSelectedClaimToReview(
                                        selectedClaimToReview === claim.id ? null : claim.id
                                      )
                                    }
                                  >
                                    Review
                                  </Button>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    Resolved by {claim.reviewedByName || 'Staff'}
                                  </span>
                                )}
                              </td>
                            </tr>

                            {/* Inline review form */}
                            {selectedClaimToReview === claim.id && (
                              <tr>
                                <td colSpan={7}>
                                  <div className="claim-review-inline">
                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
                                      Review Ownership Claim #{claim.id} for "{claim.itemTitle}"
                                    </h4>
                                    <textarea
                                      className="review-feedback-input"
                                      rows={2}
                                      placeholder="Optional remarks, desk pickup instructions, or reason for decision..."
                                      value={reviewFeedback}
                                      onChange={(e) => setReviewFeedback(e.target.value)}
                                    />
                                    <div className="review-action-row">
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedClaimToReview(null);
                                          setReviewFeedback('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        loading={reviewing}
                                        onClick={() => handleReviewClaim(claim.id, 'REJECTED')}
                                        style={{ color: '#dc2626' }}
                                      >
                                        Reject Claim
                                      </Button>
                                      <Button
                                        variant="teal"
                                        size="sm"
                                        loading={reviewing}
                                        onClick={() => handleReviewClaim(claim.id, 'APPROVED')}
                                      >
                                        Approve & Verify Ownership
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REPORTS MANAGEMENT */}
            {activeTab === 'reports' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">All Campus Item Reports ({filteredReports.length})</h3>
                  <div style={{ width: '280px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Filter reports by title/location..."
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                    />
                  </div>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Item Details</th>
                        <th>Category</th>
                        <th>Campus Location</th>
                        <th>Current Status</th>
                        <th>Security Desk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report) => (
                        <tr key={report.id}>
                          <td><strong>#{report.id}</strong></td>
                          <td>
                            <span className={`badge ${report.type === 'lost' ? 'badge-lost' : 'badge-found'}`}>
                              {report.type}
                            </span>
                          </td>
                          <td>
                            <div><strong>{report.title}</strong></div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {report.formattedDate || report.date}
                            </div>
                          </td>
                          <td>{report.category}</td>
                          <td>{report.location}</td>
                          <td>
                            <select
                              value={
                                report.status === 'Held at Helpdesk'
                                  ? 'HELD_AT_DESK'
                                  : report.status === 'Claimed'
                                  ? 'CLAIMED'
                                  : report.status === 'Resolved'
                                  ? 'RESOLVED'
                                  : 'REPORTED'
                              }
                              onChange={(e) =>
                                handleUpdateReportStatus(
                                  report.id,
                                  e.target.value,
                                  report.securityVerified
                                )
                              }
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.8rem',
                                borderRadius: '0.35rem',
                                border: '1px solid #cbd5e1',
                              }}
                            >
                              <option value="REPORTED">REPORTED</option>
                              <option value="HELD_AT_DESK">HELD_AT_DESK</option>
                              <option value="CLAIMED">CLAIMED</option>
                              <option value="RESOLVED">RESOLVED</option>
                            </select>
                          </td>
                          <td>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={report.securityVerified}
                                onChange={(e) =>
                                  handleUpdateReportStatus(
                                    report.id,
                                    report.status === 'Held at Helpdesk' ? 'HELD_AT_DESK' : 'REPORTED',
                                    e.target.checked
                                  )
                                }
                              />
                              <span>Verified</span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Registered Anurag University Accounts ({users.length})</h3>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email (@anurag.edu.in)</th>
                        <th>Role</th>
                        <th>Student / Campus ID</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td><strong>#{u.id}</strong></td>
                          <td><strong>{u.fullName}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className="status-tag status-held">{u.role}</span>
                          </td>
                          <td>{u.campusId || '—'}</td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
